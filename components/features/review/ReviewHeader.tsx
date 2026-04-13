"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useReviewStore } from "@/store";
import type { Dataset } from "@/types";

interface ReviewHeaderProps {
  dataset: Dataset;
  onSubmit: () => void | Promise<void>;
}

export function ReviewHeader({ dataset, onSubmit }: ReviewHeaderProps) {
  const router = useRouter();

  const { getProgress, isSubmitting } = useReviewStore(
    useShallow((state) => ({
      getProgress: state.getProgress,
      isSubmitting: state.isSubmitting,
    }))
  );

  const progress = getProgress();
  const allResolved = progress.resolved === progress.total && progress.total > 0;

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <header className="bg-white border-b border-[#e2e8f0] p-4 shadow-[0_1px_3px_rgba(0,0,0,.06)]">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Back button and dataset name */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-xl font-bold text-text">{dataset.name}</h1>
        </div>

        {/* Right side: Progress and submit button */}
        <div className="flex items-center gap-6">
          {/* Progress indicator */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-medium text-text-muted">
              {progress.resolved} de {progress.total} anomalías resueltas
            </span>
            <div className="w-48">
              <ProgressBar value={progress.percentage} size="sm" />
            </div>
          </div>

          {/* Submit button */}
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={!allResolved}
            loading={isSubmitting}
          >
            Finalizar revisión
          </Button>
        </div>
      </div>
    </header>
  );
}
