"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/Button";
import { useReviewStore } from "@/store";

export function AnomalyNavigation() {
  const { currentAnomalyIndex, anomalies, nextAnomaly, previousAnomaly } =
    useReviewStore(
      useShallow((state) => ({
        currentAnomalyIndex: state.currentAnomalyIndex,
        anomalies: state.anomalies,
        nextAnomaly: state.nextAnomaly,
        previousAnomaly: state.previousAnomaly,
      }))
    );

  const total = anomalies.length;
  const canGoBack = currentAnomalyIndex > 0;
  const canGoForward = currentAnomalyIndex < total - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowLeft" && canGoBack) {
        previousAnomaly();
      } else if (e.key === "ArrowRight" && canGoForward) {
        nextAnomaly();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoBack, canGoForward, nextAnomaly, previousAnomaly]);

  if (total === 0) return null;

  return (
    <nav className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={previousAnomaly}
        disabled={!canGoBack}
        aria-label="Anomalía anterior"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Anterior
      </Button>

      <span className="text-sm font-medium text-text tabular-nums">
        {currentAnomalyIndex + 1} / {total}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={nextAnomaly}
        disabled={!canGoForward}
        aria-label="Siguiente anomalía"
      >
        Siguiente
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </nav>
  );
}
