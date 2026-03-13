"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet } from "lucide-react";
import { FileDropzone } from "@/components/features/dashboard";
import { useAppStore } from "@/store";
import { getDatasets } from "@/services";
import { DATASET_STATUS, type DatasetStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  DatasetStatus,
  { label: string; bg: string }
> = {
  [DATASET_STATUS.PENDING]: { label: "PENDIENTE", bg: "bg-gray-300" },
  [DATASET_STATUS.PROCESSING]: { label: "PROCESANDO", bg: "bg-blue-300" },
  [DATASET_STATUS.AWAITING_REVIEW]: {
    label: "PENDIENTE DE REVISIÓN",
    bg: "bg-yellow-300",
  },
  [DATASET_STATUS.COMPLETED]: { label: "COMPLETADO", bg: "bg-green-300" },
  [DATASET_STATUS.FAILED]: { label: "ERROR", bg: "bg-red-300" },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const datasets = useAppStore((state) => state.datasets);
  const setDatasets = useAppStore((state) => state.setDatasets);

  useEffect(() => {
    const loadDatasets = async () => {
      const data = await getDatasets();
      setDatasets(data);
    };
    loadDatasets();
  }, [setDatasets]);

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

      {/* Grid 3 cols */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Col 1 — Upload Zone */}
        <div className="lg:col-span-1">
          <FileDropzone />
        </div>

        {/* Col 2-3 — Dataset Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-2xl font-bold uppercase flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" /> Archivos Recientes
          </h3>

          {datasets.length === 0 ? (
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
              <p className="font-medium text-gray-600">
                No hay archivos cargados aún.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {datasets.map((dataset) => {
                const config = statusConfig[dataset.status];

                return (
                  <div
                    key={dataset.id}
                    className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:-translate-y-1 transition-transform"
                  >
                    <div>
                      <h4 className="font-bold text-lg">{dataset.name}</h4>
                      <div className="flex gap-4 text-sm font-medium text-gray-600 mt-1">
                        <span>Subido: {formatDate(dataset.createdAt)}</span>
                        <span>&bull;</span>
                        <span>
                          {dataset.rowCount.toLocaleString()} filas
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span
                        className={cn(
                          "px-3 py-1 text-xs font-bold border-2 border-black w-full text-center",
                          config.bg
                        )}
                      >
                        {config.label}
                      </span>
                      {dataset.status === DATASET_STATUS.AWAITING_REVIEW && (
                        <button
                          onClick={() =>
                            router.push(`/dashboard/review/${dataset.id}`)
                          }
                          className="font-bold py-2 px-4 border-2 border-black bg-[#FF6B00] text-white text-sm whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150"
                        >
                          Revisar Anomalías
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
