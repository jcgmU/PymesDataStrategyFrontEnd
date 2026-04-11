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
  const itemsPerPage = 6;
  const totalPages = Math.ceil(total / itemsPerPage);
  const currentPage = Math.floor(currentAnomalyIndex / itemsPerPage) + 1;

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  // Custom navigation
  const goBack = () => {
    if (canGoBack) {
      useReviewStore.setState({ 
        currentAnomalyIndex: (currentPage - 2) * itemsPerPage 
      });
    }
  };

  const goForward = () => {
    if (canGoForward) {
      useReviewStore.setState({ 
        currentAnomalyIndex: currentPage * itemsPerPage 
      });
    }
  };

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
        goBack();
      } else if (e.key === "ArrowRight" && canGoForward) {
        goForward();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoBack, canGoForward]);

  if (total === 0) return null;

  return (
    <nav className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={goBack}
        disabled={!canGoBack}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Anterior
      </Button>

      <span className="text-sm font-medium text-text tabular-nums">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={goForward}
        disabled={!canGoForward}
        aria-label="Siguiente página"
      >
        Siguiente
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </nav>
  );
}
