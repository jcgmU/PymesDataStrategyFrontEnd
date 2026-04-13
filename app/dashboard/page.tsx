"use client";

import { useEffect, useRef } from "react";
import { FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { FileDropzone, DatasetsTable, FilterBar, MetricsBand } from "@/components/features/dashboard";
import { useDatasets } from "@/hooks/api";
import { useAppStore } from "@/store";
import { useGlobalSSE } from "@/hooks/useGlobalSSE";

export default function DashboardPage() {
  // Activate real-time dataset updates via SSE while the dashboard is mounted
  useGlobalSSE();

  const { data, isLoading, isError } = useDatasets();
  const setDatasets = useAppStore((state) => state.setDatasets);
  const prevStatusesRef = useRef<Record<string, string>>({});

  // Sincronizar datasets del backend con el store (para filtros y DatasetsTable)
  useEffect(() => {
    if (!data?.data) return;
    setDatasets(data.data);

    // Detectar cambios de estado y notificar al usuario
    const prevStatuses = prevStatusesRef.current;
    for (const dataset of data.data) {
      const prev = prevStatuses[dataset.id];
      if (prev && prev !== dataset.status) {
        if (dataset.status === "READY") {
          toast.success(`"${dataset.name}" listo para revisión`, { duration: 5000 });
        } else if (dataset.status === "ERROR") {
          toast.error(`Error al procesar "${dataset.name}"`, { duration: 8000 });
        }
      }
    }
    prevStatusesRef.current = Object.fromEntries(data.data.map((d) => [d.id, d.status]));
  }, [data?.data, setDatasets]);

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 pb-4 border-b border-[#e2e8f0]">
        <div>
          <h2 className="text-[22px] font-bold text-[#1e293b]">Panel de Control</h2>
          <p className="text-sm text-[#64748b] mt-1">
            Sube tus archivos Excel para análisis estructurado.
          </p>
        </div>
        <span className="text-sm text-[#64748b] font-medium">Administrador</span>
      </div>

      {/* Métricas del sistema */}
      <MetricsBand />

      {/* Grid 3 cols */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Col 1 — Upload Zone */}
        <div className="lg:col-span-1">
          <FileDropzone />
        </div>

        {/* Col 2-3 — Dataset Table */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-[#1e293b] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#64748b]" /> Archivos Recientes
          </h3>

          {isLoading && (
            <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.08)] p-8 text-center">
              <div className="animate-spin h-6 w-6 border-4 border-[#ff6600] border-t-transparent rounded-full mx-auto mb-2" />
              <p className="font-medium text-[#64748b]">Cargando datasets...</p>
            </div>
          )}

          {isError && (
            <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.08)] p-8 text-center">
              <p className="font-medium text-red-600">
                Error al cargar los datasets. Intenta de nuevo.
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="space-y-4">
              <FilterBar />
              <DatasetsTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
