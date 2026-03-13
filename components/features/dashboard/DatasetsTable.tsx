"use client";

import { useShallow } from "zustand/react/shallow";
import { useRouter } from "next/navigation";
import { Eye, Download, Trash2 } from "lucide-react";
import { Button, Badge, ProgressBar } from "@/components/ui";
import { useAppStore } from "@/store";
import { deleteDataset } from "@/services";
import { DATASET_STATUS, type DatasetStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  DatasetStatus,
  { label: string; variant: "default" | "success" | "warning" | "error" | "info" }
> = {
  [DATASET_STATUS.PENDING]: { label: "Pendiente", variant: "default" },
  [DATASET_STATUS.PROCESSING]: { label: "Procesando", variant: "info" },
  [DATASET_STATUS.AWAITING_REVIEW]: { label: "En revisión", variant: "warning" },
  [DATASET_STATUS.COMPLETED]: { label: "Completado", variant: "success" },
  [DATASET_STATUS.FAILED]: { label: "Error", variant: "error" },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DatasetsTable() {
  const router = useRouter();

  const { getFilteredDatasets, removeDataset } = useAppStore(
    useShallow((state) => ({
      getFilteredDatasets: state.getFilteredDatasets,
      removeDataset: state.removeDataset,
    }))
  );

  const datasets = getFilteredDatasets();

  const handleReview = (id: string) => {
    router.push(`/dashboard/review/${id}`);
  };

  const handleDownload = (id: string) => {
    // TODO: Implement download functionality
    console.log("Download dataset:", id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDataset(id);
      removeDataset(id);
    } catch (error) {
      console.error("Error deleting dataset:", error);
    }
  };

  if (datasets.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border-2 border-black rounded-md bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-text-muted font-medium">No hay datasets cargados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <table className="w-full">
        <thead>
          <tr className="bg-surface border-b-2 border-black">
            <th className="px-4 py-3 text-left font-bold text-text">Nombre</th>
            <th className="px-4 py-3 text-left font-bold text-text">Filas</th>
            <th className="px-4 py-3 text-left font-bold text-text">Estado</th>
            <th className="px-4 py-3 text-left font-bold text-text">Progreso</th>
            <th className="px-4 py-3 text-right font-bold text-text">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((dataset, index) => {
            const config = statusConfig[dataset.status];
            const isLast = index === datasets.length - 1;

            return (
              <tr
                key={dataset.id}
                className={cn(
                  "bg-background hover:bg-surface-hover transition-colors",
                  !isLast && "border-b-2 border-black"
                )}
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-text">{dataset.name}</p>
                    <p className="text-xs text-text-muted">
                      {dataset.originalName} · {formatFileSize(dataset.fileSize)}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-text">{dataset.rowCount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={config.variant}>{config.label}</Badge>
                </td>
                <td className="px-4 py-3 w-32">
                  {dataset.status === DATASET_STATUS.PROCESSING ? (
                    <ProgressBar value={dataset.progress} size="sm" />
                  ) : (
                    <span className="text-sm text-text-muted">
                      {dataset.progress}%
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {dataset.status === DATASET_STATUS.AWAITING_REVIEW && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReview(dataset.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Revisar
                      </Button>
                    )}
                    {dataset.status === DATASET_STATUS.COMPLETED && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownload(dataset.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(dataset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
