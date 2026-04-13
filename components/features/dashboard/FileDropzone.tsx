"use client";

import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { UploadCloud, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProgressBar } from "@/components/ui";
import { useAppStore } from "@/store";
import { useUploadDataset } from "@/hooks/api";
import { useJobPoller } from "@/hooks/useJobPoller";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { isUploading, uploadProgress, setUploading } = useAppStore(
    useShallow((state) => ({
      isUploading: state.isUploading,
      uploadProgress: state.uploadProgress,
      setUploading: state.setUploading,
    }))
  );

  const uploadMutation = useUploadDataset();
  const { jobStatus, isCompleted, isFailed, error: jobError } = useJobPoller(jobId);

  useEffect(() => {
    if (isCompleted || isFailed) {
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    }

    if (isCompleted) {
      toast.success("¡ETL completado! El dataset está listo.");
      const timer = setTimeout(() => {
        setJobId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, isFailed, queryClient]);

  const validateFile = (file: File): string | null => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const isValidType =
      ACCEPTED_TYPES.includes(file.type) ||
      ACCEPTED_EXTENSIONS.includes(extension);

    if (!isValidType) {
      return "Formato no válido. Solo se aceptan archivos CSV, XLSX o XLS.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "El archivo excede el tamaño máximo de 10MB.";
    }

    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setJobId(null);
    setUploading(true, 0);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + 10, 90);
      setUploading(true, progress);
    }, 150);

    uploadMutation.mutate(file, {
      onSuccess: (response) => {
        clearInterval(progressInterval);
        setUploading(true, 100);
        toast.success("Archivo subido correctamente. Procesando...");
        setTimeout(() => {
          setUploading(false, 0);
          if (response?.data?.jobId) {
            setJobId(response.data.jobId);
          }
        }, 500);
      },
      onError: () => {
        clearInterval(progressInterval);
        setError("Error al subir el archivo. Intenta de nuevo.");
        toast.error("Error al subir el archivo. Intenta de nuevo.");
        setUploading(false, 0);
      },
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!isUploading && jobId === null) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = "";
  };

  const handleRetry = () => {
    setJobId(null);
    setError(null);
  };

  const isProcessing = jobId !== null && !isCompleted && !isFailed;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "bg-white rounded-[10px] border-2 border-dashed border-[#e2e8f0]",
        "flex flex-col items-center justify-center p-12 text-center",
        "h-full min-h-[300px] transition-colors",
        isDragging && "border-[#ff6600] bg-[#fff0e6]",
        !isDragging && !isUploading && jobId === null && "hover:border-[#ff6600] hover:bg-[#fff0e6] cursor-pointer",
        (isUploading || isProcessing) && "cursor-not-allowed opacity-75",
        (isCompleted || isFailed) && "cursor-default"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || isProcessing}
      />

      {/* Estado: Subiendo */}
      {isUploading && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="bg-[#ff6600] p-4 rounded-full mb-4">
            <UploadCloud className="w-10 h-10 text-white animate-pulse" />
          </div>
          <p className="text-xl font-bold text-[#1e293b]">Subiendo archivo...</p>
          <ProgressBar value={uploadProgress} size="md" showLabel />
        </div>
      )}

      {/* Estado: Procesando */}
      {!isUploading && isProcessing && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="bg-[#ff6600] p-4 rounded-full mb-4">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-xl font-bold text-[#1e293b]">Procesando dataset...</p>
          {jobStatus && (
            <span className="font-mono text-sm bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg px-3 py-1 text-[#64748b]">
              {jobStatus}
            </span>
          )}
          <p className="text-sm text-[#64748b] font-medium">Job: {jobId}</p>
        </div>
      )}

      {/* Estado: Completado */}
      {!isUploading && isCompleted && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="bg-[#059669] p-4 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl font-bold text-[#059669]">¡Dataset listo!</p>
        </div>
      )}

      {/* Estado: Fallido */}
      {!isUploading && isFailed && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="bg-[#dc2626] p-4 rounded-full mb-4">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl font-bold text-[#dc2626]">Error al procesar</p>
          {jobError && (
            <p className="text-sm text-red-600 font-medium">{jobError}</p>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRetry();
            }}
            className="w-full font-semibold py-3 px-6 rounded-lg bg-[#ff6600] text-white hover:bg-[#cc5200] hover:shadow-[0_4px_12px_rgba(255,102,0,.3)] active:scale-[0.98] transition-all duration-150"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado: Idle */}
      {!isUploading && !isProcessing && !isCompleted && !isFailed && (
        <>
          <div className="bg-[#ff6600] p-4 rounded-full mb-4">
            <UploadCloud className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1e293b] mb-2">Arrastra tu Excel aquí</h3>
          <p className="font-medium text-[#64748b] mb-6">
            Máximo 50,000 registros (.xlsx)
          </p>
          <button
            type="button"
            className="font-semibold py-3 px-6 rounded-lg bg-[#ff6600] text-white hover:bg-[#cc5200] hover:shadow-[0_4px_12px_rgba(255,102,0,.3)] active:scale-[0.98] transition-all duration-150 w-full"
          >
            Seleccionar Archivo
          </button>
        </>
      )}

      {error && !isFailed && (
        <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
