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

  // Cuando el job se completa o falla, invalida para refrescar la tabla y las métricas
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

    // Simulate progress while uploading
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
          // Guardar jobId para iniciar polling
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
    // Reset input to allow re-selecting same file
    e.target.value = "";
  };

  const handleRetry = () => {
    setJobId(null);
    setError(null);
  };

  // Estado: processing (job en curso)
  const isProcessing = jobId !== null && !isCompleted && !isFailed;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "bg-white border-4 border-dashed border-black transition-colors",
        "flex flex-col items-center justify-center p-12 text-center",
        "h-full min-h-[300px]",
        "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        isDragging && "border-solid bg-orange-100",
        !isDragging && !isUploading && jobId === null && "hover:bg-orange-50 cursor-pointer",
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
          <div className="bg-[#0033A0] p-4 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <UploadCloud className="w-10 h-10 text-white animate-pulse" />
          </div>
          <p className="text-xl font-bold">Subiendo archivo...</p>
          <ProgressBar value={uploadProgress} size="md" showLabel />
        </div>
      )}

      {/* Estado: Procesando */}
      {!isUploading && isProcessing && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="bg-[#0033A0] p-4 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-xl font-bold">Procesando dataset...</p>
          {jobStatus && (
            <span className="font-mono text-sm bg-gray-100 border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {jobStatus}
            </span>
          )}
          <p className="text-sm text-gray-500 font-medium">Job: {jobId}</p>
        </div>
      )}

      {/* Estado: Completado */}
      {!isUploading && isCompleted && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="bg-green-500 p-4 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl font-bold text-green-700">¡Dataset listo!</p>
        </div>
      )}

      {/* Estado: Fallido */}
      {!isUploading && isFailed && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="bg-red-500 p-4 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl font-bold text-red-700">Error al procesar</p>
          {jobError && (
            <p className="text-sm text-red-600 font-medium">{jobError}</p>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRetry();
            }}
            className="font-bold py-3 px-6 border-2 border-black bg-[#FF6B00] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 w-full"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado: Idle */}
      {!isUploading && !isProcessing && !isCompleted && !isFailed && (
        <>
          <div className="bg-[#0033A0] p-4 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <UploadCloud className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Arrastra tu Excel aquí</h3>
          <p className="font-medium text-gray-600 mb-6">
            Máximo 50,000 registros (.xlsx)
          </p>
          <button
            type="button"
            className="font-bold py-3 px-6 border-2 border-black bg-[#FF6B00] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 w-full"
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
