"use client";

import { Check, X, PenTool, CheckCircle2 } from "lucide-react";
import { useReviewStore } from "@/store";
import { ANOMALY_TYPE, REVIEW_ACTION } from "@/types";
import type { Anomaly, AnomalyType } from "@/types";
import { Card } from "@/components/ui/Card";

const ANOMALY_DESCRIPTIONS: Record<AnomalyType, (rows: number) => string> = {
  [ANOMALY_TYPE.FILL_NULLS]: (rows) =>
    `Se detectaron ${rows} valores nulos (celdas vacías).`,
  [ANOMALY_TYPE.REMOVE_DUPLICATES]: (rows) =>
    `${rows} registros duplicados encontrados.`,
  [ANOMALY_TYPE.TRIM_WHITESPACE]: (rows) =>
    `${rows} celdas con espacios en blanco innecesarios.`,
  [ANOMALY_TYPE.FIX_DATE_FORMAT]: (rows) =>
    `${rows} fechas con formato inconsistente.`,
  [ANOMALY_TYPE.NORMALIZE_CASE]: (rows) =>
    `${rows} valores con capitalización inconsistente.`,
  [ANOMALY_TYPE.REMOVE_OUTLIERS]: (rows) =>
    `${rows} valores atípicos (outliers) detectados.`,
  [ANOMALY_TYPE.FIX_PHONE_FORMAT]: (rows) =>
    `${rows} teléfonos con formato irregular.`,
  [ANOMALY_TYPE.VALIDATE_EMAIL]: (rows) =>
    `${rows} emails con formato inválido.`,
  [ANOMALY_TYPE.STANDARDIZE_ADDRESS]: (rows) =>
    `${rows} direcciones sin estandarizar.`,
  [ANOMALY_TYPE.FIX_CURRENCY]: (rows) =>
    `${rows} valores monetarios con formato inconsistente.`,
  [ANOMALY_TYPE.MERGE_COLUMNS]: (rows) =>
    `${rows} registros candidatos para fusión de columnas.`,
};

interface AnomalyCardProps {
  anomaly: Anomaly;
}

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
  const approveAnomaly = useReviewStore((s) => s.approveAnomaly);
  const discardAnomaly = useReviewStore((s) => s.discardAnomaly);

  const isPending = anomaly.action === REVIEW_ACTION.PENDING;
  const isApproved = anomaly.action === REVIEW_ACTION.APPROVED;
  const isDiscarded = anomaly.action === REVIEW_ACTION.DISCARDED;

  const description = ANOMALY_DESCRIPTIONS[anomaly.type](anomaly.affectedRows);

  const handleUndo = () => {
    useReviewStore.setState((state) => {
      const a = state.anomalies.find((a) => a.id === anomaly.id);
      if (a) {
        a.action = REVIEW_ACTION.PENDING;
        a.userCorrection = undefined;
      }
    });
  };

  return (
    <Card
      className={`bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col transition-all${!isPending ? " opacity-60 bg-gray-50" : ""}`}
    >
      {/* Header con badge de columna */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-black text-white font-bold px-3 py-1 text-sm inline-block border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,107,0,1)]">
          Columna: {anomaly.column}
        </span>
        {isApproved && <CheckCircle2 className="w-8 h-8 text-green-600" />}
        {isDiscarded && <X className="w-8 h-8 text-red-600" />}
      </div>

      {/* Contenido */}
      <div className="flex-1 space-y-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase text-gray-500 mb-1">
            Anomalía Detectada
          </p>
          <p className="font-bold text-lg">{description}</p>
        </div>
        <div className="bg-blue-50 p-3 border-l-4 border-[#0033A0]">
          <p className="text-xs font-bold uppercase text-[#0033A0] mb-1">
            Sugerencia IA
          </p>
          <p className="font-medium">{anomaly.suggestedFix}</p>
        </div>
      </div>

      {/* Botones */}
      {isPending ? (
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => approveAnomaly(anomaly.id)}
            className="col-span-2 font-bold py-2 px-6 border-2 border-black bg-green-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Aprobar Regla
          </button>
          <button
            onClick={() => discardAnomaly(anomaly.id)}
            className="font-bold py-2 px-6 border-2 border-black bg-red-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Descartar
          </button>
          <button
            className="font-bold py-2 px-6 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
          >
            <PenTool className="w-4 h-4" /> Editar
          </button>
        </div>
      ) : (
        <div className="mt-auto">
          <button
            onClick={handleUndo}
            className="w-full font-bold py-2 px-6 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
          >
            Deshacer Acción
          </button>
        </div>
      )}
    </Card>
  );
}
