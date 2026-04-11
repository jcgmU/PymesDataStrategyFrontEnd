"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Eye, Download, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button, Badge } from "@/components/ui";
import { useAppStore } from "@/store";
import { useDeleteDataset } from "@/hooks/api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { DATASET_STATUS, type DatasetStatus } from "@/types";
import { cn } from "@/lib/utils";
import { ReportModal } from "./ReportModal";

const statusConfig: Record<
  DatasetStatus,
  { label: string; variant: "default" | "success" | "warning" | "error" | "info" }
> = {
  [DATASET_STATUS.PENDING]: { label: "Pendiente", variant: "default" },
  [DATASET_STATUS.PROCESSING]: { label: "Procesando", variant: "info" },
  [DATASET_STATUS.READY]: { label: "Listo", variant: "success" },
  [DATASET_STATUS.ERROR]: { label: "Error", variant: "error" },
  [DATASET_STATUS.ARCHIVED]: { label: "Archivado", variant: "default" },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DatasetsTable() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken ?? undefined;
  const deleteDatasetMutation = useDeleteDataset();
  const [reportDatasetId, setReportDatasetId] = useState<string | null>(null);

  const { getFilteredDatasets } = useAppStore(
    useShallow((state) => ({
      getFilteredDatasets: state.getFilteredDatasets,
    }))
  );

  const datasets = getFilteredDatasets();

  const handleReview = (id: string) => {
    router.push(`/dashboard/review/${id}`);
  };

  const handleDownload = (id: string) => {
    if (!token) {
      toast.error("No se pudo obtener el enlace de descarga.");
      return;
    }
    window.open(API_ENDPOINTS.datasets.stream(id, token), "_blank");
  };

  const handleDelete = (id: string) => {
    deleteDatasetMutation.mutate(id);
  };

  if (datasets.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border-2 border-black rounded-md bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-text-muted font-medium">No hay datasets cargados</p>
      </div>
    );
  }

  return (
    <>
    <div className="overflow-x-auto border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <table className="w-full">
        <thead>
          <tr className="bg-surface border-b-2 border-black">
            <th className="px-4 py-3 text-left font-bold text-text">Nombre</th>
            <th className="px-4 py-3 text-left font-bold text-text">Tamaño</th>
            <th className="px-4 py-3 text-left font-bold text-text">Estado</th>
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
                      {dataset.originalFileName}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-text">{formatFileSize(dataset.fileSizeBytes)}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={config.variant}>{config.label}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {dataset.status === DATASET_STATUS.PROCESSING && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReview(dataset.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    )}
                    {dataset.status === DATASET_STATUS.READY && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReportDatasetId(dataset.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Informe
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownload(dataset.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(dataset.id)}
                      disabled={deleteDatasetMutation.isPending}
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
    {reportDatasetId && (
      <ReportModal
        datasetId={reportDatasetId}
        datasetName={datasets.find(d => d.id === reportDatasetId)?.name ?? reportDatasetId}
        onClose={() => setReportDatasetId(null)}
      />
    )}
    </>
  );
}
