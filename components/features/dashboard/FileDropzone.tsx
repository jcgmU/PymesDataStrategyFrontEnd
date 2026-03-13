"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { UploadCloud } from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { useAppStore } from "@/store";
import { uploadDataset } from "@/services";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, uploadProgress, setUploading, addDataset } = useAppStore(
    useShallow((state) => ({
      isUploading: state.isUploading,
      uploadProgress: state.uploadProgress,
      setUploading: state.setUploading,
      addDataset: state.addDataset,
    }))
  );

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
    setUploading(true, 0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploading(true, Math.min(uploadProgress + 10, 90));
    }, 150);

    try {
      const dataset = await uploadDataset(file);
      clearInterval(progressInterval);
      setUploading(true, 100);
      addDataset(dataset);

      // Reset after short delay
      setTimeout(() => {
        setUploading(false, 0);
      }, 500);
    } catch {
      clearInterval(progressInterval);
      setError("Error al subir el archivo. Intenta de nuevo.");
      setUploading(false, 0);
    }
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
    if (!isUploading) {
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

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "bg-white border-4 border-dashed border-black transition-colors",
        "flex flex-col items-center justify-center p-12 text-center",
        "h-full min-h-[300px] cursor-pointer",
        "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        isDragging && "border-solid bg-orange-100",
        !isDragging && !isUploading && "hover:bg-orange-50",
        isUploading && "cursor-not-allowed opacity-75"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="bg-[#0033A0] p-4 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <UploadCloud className="w-10 h-10 text-white animate-pulse" />
          </div>
          <p className="text-xl font-bold">Subiendo archivo...</p>
          <ProgressBar value={uploadProgress} size="md" showLabel />
        </div>
      ) : (
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

      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
