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
      <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
        <div>
          <h2 className="text-4xl font-black uppercase">Panel de Control</h2>
          <p className="text-lg font-medium text-gray-600 mt-1">
            Sube tus archivos Excel para análisis estructurado.
          </p>
        </div>
        <div className="bg-white border-2 border-black px-4 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Administrador
        </div>
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
          <h3 className="text-2xl font-bold uppercase flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" /> Archivos Recientes
          </h3>

          {isLoading && (
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
              <div className="animate-spin h-6 w-6 border-4 border-[#0033A0] border-t-transparent rounded-full mx-auto mb-2" />
              <p className="font-medium text-gray-600">Cargando datasets...</p>
            </div>
          )}

          {isError && (
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
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
