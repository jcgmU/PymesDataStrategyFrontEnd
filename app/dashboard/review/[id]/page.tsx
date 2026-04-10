"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { AnomalyCard, ReviewHeader, AnomalyNavigation } from "@/components/features/review";
import { useReviewStore } from "@/store";
import { useDataset, useAnomalies, useSubmitDecisions } from "@/hooks/api";
import { REVIEW_ACTION } from "@/types";
import type { Anomaly } from "@/types";
import type { ApiAnomaly } from "@/types/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Map a backend ApiAnomaly to the frontend store Anomaly shape.
 * The backend uses its own type vocabulary; the store uses the frontend review vocabulary.
 */
function mapApiAnomalyToStore(a: ApiAnomaly): Anomaly {
  // Determine AnomalyType from backend type
  const typeMap: Record<ApiAnomaly["type"], Anomaly["type"]> = {
    MISSING_VALUE: "FILL_NULLS",
    DUPLICATE: "REMOVE_DUPLICATES",
    FORMAT_ERROR: "FIX_DATE_FORMAT",
    OUTLIER: "REMOVE_OUTLIERS",
  };

  return {
    id: a.id,
    datasetId: a.datasetId,
    type: typeMap[a.type] ?? "FILL_NULLS",
    column: a.column,
    affectedRows: a.row ?? 0,
    sampleValues: a.originalValue ? [a.originalValue] : [],
    suggestedFix: a.suggestedValue ?? a.description,
    aiSuggestion: a.aiSuggestion ?? null,
    aiActionType: a.aiActionType ?? null,
    aiActionValue: a.aiActionValue ?? null,
    confidence: 1,
    action: a.decision
      ? (a.decision.action as Anomaly["action"])
      : REVIEW_ACTION.PENDING,
    userCorrection: a.decision?.correction ?? undefined,
  };
}

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const datasetId = params.id;

  const anomalies = useReviewStore((s) => s.anomalies);
  const setAnomalies = useReviewStore((s) => s.setAnomalies);
  const resetReview = useReviewStore((s) => s.resetReview);
  const currentAnomalyIndex = useReviewStore((s) => s.currentAnomalyIndex);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dataset real desde el backend
  const {
    data: datasetResponse,
    isLoading: isDatasetLoading,
    isError: isDatasetError,
  } = useDataset(datasetId);

  // Anomalías reales desde el backend — polling activo para recibir sugerencias Gemini
  const {
    data: anomaliesResponse,
    isLoading: isAnomaliesLoading,
  } = useAnomalies(datasetId, true);

  const submitDecisionsMutation = useSubmitDecisions(datasetId);

  const dataset = datasetResponse?.data ?? null;

  const pendingCount = anomalies.filter(
    (a) => a.action === REVIEW_ACTION.PENDING
  ).length;

  const [initialized, setInitialized] = useState(false);

  // Primera carga: inicializa el store completo.
  // Recargas por polling: solo actualiza aiSuggestion para no pisar decisiones del usuario.
  useEffect(() => {
    if (!anomaliesResponse?.data) return;

    if (!initialized) {
      const mapped = anomaliesResponse.data.map(mapApiAnomalyToStore);
      setAnomalies(mapped);
      setInitialized(true);
    } else {
      // Refrescar campos de IA desde el backend sin pisar decisiones del usuario.
      // IMPORTANTE: además de `aiSuggestion`, traer `aiActionType` y `aiActionValue`
      // (cuando Gemini responde después del primer load, estos son los que habilitan
      // el botón "Aceptar IA" y el seed del input en "Editar").
      useReviewStore.setState((state) => {
        const updated = state.anomalies.map((a) => {
          const fresh = anomaliesResponse.data.find((r) => r.id === a.id);
          if (!fresh) return a;
          // No tocar anomalías que el usuario ya resolvió
          if (a.action !== REVIEW_ACTION.PENDING) return a;
          return {
            ...a,
            aiSuggestion: fresh.aiSuggestion ?? a.aiSuggestion ?? null,
            aiActionType: fresh.aiActionType ?? a.aiActionType ?? null,
            aiActionValue: fresh.aiActionValue ?? a.aiActionValue ?? null,
            // Preserve IR correction fields — never overwrite local user decisions
            userCorrectionIr: a.userCorrectionIr ?? null,
            userCorrectionText: a.userCorrectionText ?? null,
            userCorrectionSource: a.userCorrectionSource ?? null,
          };
        });
        return { anomalies: updated };
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anomaliesResponse]);

  useEffect(() => {
    return () => { resetReview(); setInitialized(false); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitETL = async () => {
    setIsSubmitting(true);
    useReviewStore.setState({ isSubmitting: true });
    try {
      const decisions = anomalies.map((a) => ({
        anomalyId: a.id,
        action: a.action as "APPROVED" | "CORRECTED" | "DISCARDED",
        ...(a.userCorrection !== undefined ? { correction: a.userCorrection } : {}),
        ...(a.userCorrectionIr != null ? { correctionIr: a.userCorrectionIr } : {}),
        ...(a.userCorrectionSource != null ? { irSource: a.userCorrectionSource } : {}),
        ...(a.userCorrectionText != null ? { irRawText: a.userCorrectionText } : {}),
      }));

      await submitDecisionsMutation.mutateAsync({ decisions });
      toast.success("Decisiones enviadas correctamente. Ejecutando ETL...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error al enviar decisiones:", err);
      toast.error("Error al enviar las decisiones. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
      useReviewStore.setState({ isSubmitting: false });
    }
  };

  // Loading state
  if (isDatasetLoading || isAnomaliesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#0033A0] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500 font-bold">Cargando revisión...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isDatasetError || !dataset) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <p className="text-red-600 font-bold mb-4">
            Dataset no encontrado o error al cargarlo.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="font-bold py-2 px-6 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* ReviewHeader component — con botón volver y progreso */}
      <ReviewHeader dataset={dataset} onSubmit={handleSubmitETL} />

      <div className="flex-1 p-8 overflow-auto">
        {/* Banner azul informativo */}
        <div className="bg-[#0033A0] text-white border-2 border-black p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase">
              Revisión de IA: {dataset.name}
            </h2>
            <p className="text-lg font-medium mt-2 opacity-90">
              El Agente IA ha perfilado los datos y sugiere las siguientes reglas
              de limpieza.
            </p>
          </div>
          <div className="bg-white text-black font-black text-2xl px-6 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
            {pendingCount} <br />
            <span className="text-sm uppercase font-bold">Pendientes</span>
          </div>
        </div>

        {/* Grid de anomalías */}
        {anomalies.length > 0 ? (
          <>
            {/* AnomalyNavigation component */}
            <div className="mb-6">
              <AnomalyNavigation />
            </div>
            
            {/* Mostrar solo las anomalías de la página actual */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(() => {
                const itemsPerPage = 6;
                const startIndex = Math.floor(currentAnomalyIndex / itemsPerPage) * itemsPerPage;
                const visibleAnomalies = anomalies.slice(startIndex, startIndex + itemsPerPage);
                return visibleAnomalies.map((anomaly) => (
                  <AnomalyCard key={anomaly.id} anomaly={anomaly} />
                ));
              })()}
            </div>
          </>
        ) : (
          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
            <p className="font-bold text-lg">
              No se detectaron anomalías en este dataset.
            </p>
          </div>
        )}

        {/* Botón ETL cuando todas resueltas (alternativo al ReviewHeader) */}
        {pendingCount === 0 && anomalies.length > 0 && (
          <div className="mt-12 flex justify-center">
            <p className="text-sm font-medium text-gray-600">
              Usa el botón &ldquo;Finalizar revisión&rdquo; en la cabecera para enviar las decisiones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
