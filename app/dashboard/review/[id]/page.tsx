"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Play } from "lucide-react";
import { AnomalyCard } from "@/components/features/review";
import { useReviewStore } from "@/store";
import { getAnomalies, getDataset, submitAllDecisions } from "@/services";
import { REVIEW_ACTION } from "@/types";
import type { Dataset } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReviewPage({ params }: PageProps) {
  const { id: datasetId } = use(params);
  const router = useRouter();

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const anomalies = useReviewStore((s) => s.anomalies);
  const setAnomalies = useReviewStore((s) => s.setAnomalies);
  const resetReview = useReviewStore((s) => s.resetReview);

  const pendingCount = anomalies.filter(
    (a) => a.action === REVIEW_ACTION.PENDING
  ).length;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [datasetData, anomaliesData] = await Promise.all([
          getDataset(datasetId),
          getAnomalies(datasetId),
        ]);

        if (!datasetData) {
          setError("Dataset no encontrado");
          return;
        }

        setDataset(datasetData);
        setAnomalies(anomaliesData);
      } catch (err) {
        console.error("Error loading review data:", err);
        setError("Error al cargar los datos de revisión");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      resetReview();
    };
  }, [datasetId, setAnomalies, resetReview]);

  const handleSubmitETL = async () => {
    setIsSubmitting(true);
    try {
      const decisions = anomalies.map((a) => ({
        anomalyId: a.id,
        action: a.action,
        correction: a.userCorrection,
      }));
      await submitAllDecisions(decisions);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error submitting decisions:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
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
  if (error || !dataset) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <p className="text-red-600 font-bold mb-4">
            {error || "Dataset no encontrado"}
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
    <div className="flex-1 p-8 overflow-auto">
      {/* Botón volver */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="font-bold border-b-2 border-black hover:text-[#FF6B00] hover:border-[#FF6B00]"
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Banner azul */}
      <div className="bg-[#0033A0] text-white border-2 border-black p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-[#FF6B00]" />
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
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {anomalies.map((anomaly) => (
            <AnomalyCard key={anomaly.id} anomaly={anomaly} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <p className="font-bold text-lg">
            No se detectaron anomalías en este dataset.
          </p>
        </div>
      )}

      {/* Botón ETL cuando todas resueltas */}
      {pendingCount === 0 && anomalies.length > 0 && (
        <div className="mt-12 flex justify-center animate-bounce">
          <button
            onClick={handleSubmitETL}
            disabled={isSubmitting}
            className="font-bold py-6 px-12 text-xl border-2 border-black bg-[#FF6B00] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Ejecutar Motor ETL"}
            {!isSubmitting && (
              <Play className="w-6 h-6 ml-2" fill="currentColor" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
