"use client";

import { useState } from "react";
import { Check, X, PenTool, CheckCircle2 } from "lucide-react";
import { useReviewStore } from "@/store";
import { REVIEW_ACTION } from "@/types";
import type { Anomaly } from "@/types";

interface AnomalyGroup {
  type: string;
  label: string;
  totalRows: number;
  anomalies: Anomaly[];
}

interface Props {
  group: AnomalyGroup;
  datasetId: string;
}

const TYPE_HEADER_COLORS: Record<string, string> = {
  MISSING_VALUE: "bg-yellow-400",
  WHITESPACE_ONLY: "bg-yellow-300",
  SUSPICIOUS_PLACEHOLDER: "bg-yellow-300",
  LEADING_TRAILING_WHITESPACE: "bg-yellow-200",
  DUPLICATE: "bg-red-400",
  SEQUENCE_GAP: "bg-red-300",
  OUTLIER: "bg-[#FF6B00]",
  NUMERIC_ROUND_NUMBER: "bg-orange-400",
  LOW_VARIANCE: "bg-orange-300",
  OUTLIER_IQR: "bg-orange-400",
  FORMAT_ERROR: "bg-[#0033A0] text-white",
  FORMAT_INVALID: "bg-blue-600 text-white",
  DATE_LOGICAL: "bg-blue-400",
  INCONSISTENT: "bg-purple-400",
  CROSS_FIELD_SWAP: "bg-purple-500 text-white",
};

function getHeaderClass(type: string): string {
  return TYPE_HEADER_COLORS[type] ?? "bg-gray-300";
}

/** Row for a single anomaly (one column) inside the group card */
function AnomalyRow({ anomaly }: { anomaly: Anomaly }) {
  const approveAnomaly = useReviewStore((s) => s.approveAnomaly);
  const discardAnomaly = useReviewStore((s) => s.discardAnomaly);
  const correctAnomaly = useReviewStore((s) => s.correctAnomaly);

  const [correcting, setCorrecting] = useState(false);
  const [inputValue, setInputValue] = useState(anomaly.userCorrection ?? "");

  const isApproved = anomaly.action === REVIEW_ACTION.APPROVED;
  const isDiscarded = anomaly.action === REVIEW_ACTION.DISCARDED;
  const isCorrected = anomaly.action === REVIEW_ACTION.CORRECTED;
  const isPending = anomaly.action === REVIEW_ACTION.PENDING;

  const handleUndo = () => {
    useReviewStore.setState((state) => {
      const a = state.anomalies.find((a) => a.id === anomaly.id);
      if (a) {
        a.action = REVIEW_ACTION.PENDING;
        a.userCorrection = undefined;
        a.userCorrectionIr = null;
        a.userCorrectionText = null;
        a.userCorrectionSource = null;
      }
    });
    setCorrecting(false);
  };

  const handleConfirmCorrection = () => {
    if (inputValue.trim()) {
      correctAnomaly(anomaly.id, inputValue.trim());
      setCorrecting(false);
    }
  };

  const sampleValue = anomaly.sampleValues?.[0];

  return (
    <div className="border-b border-gray-200 last:border-0 py-3 px-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Column badge */}
        <span className="bg-black text-white font-bold text-xs px-2 py-1 border border-black shadow-[2px_2px_0px_0px_rgba(255,107,0,1)] shrink-0">
          {anomaly.column}
        </span>

        {/* Row count + sample */}
        <span className="text-sm font-medium text-gray-600 shrink-0">
          {anomaly.affectedRows} fila{anomaly.affectedRows !== 1 ? "s" : ""}
          {sampleValue ? (
            <span className="text-gray-400 ml-1">
              · Ejemplo: <span className="italic">&ldquo;{sampleValue}&rdquo;</span>
            </span>
          ) : null}
        </span>

        {/* Status badge (if decided) */}
        {isApproved && (
          <span className="ml-auto flex items-center gap-1 bg-green-100 text-green-800 font-bold text-xs px-2 py-1 border border-green-500">
            <CheckCircle2 className="w-3 h-3" /> Aprobada
          </span>
        )}
        {isDiscarded && (
          <span className="ml-auto flex items-center gap-1 bg-red-100 text-red-800 font-bold text-xs px-2 py-1 border border-red-500">
            <X className="w-3 h-3" /> Descartada
          </span>
        )}
        {isCorrected && (
          <span className="ml-auto flex items-center gap-1 bg-blue-100 text-blue-800 font-bold text-xs px-2 py-1 border border-blue-500">
            <PenTool className="w-3 h-3" /> Corregida
            {anomaly.userCorrection ? (
              <span className="font-normal">: &ldquo;{anomaly.userCorrection}&rdquo;</span>
            ) : null}
          </span>
        )}

        {/* Action buttons — only when pending */}
        {isPending && (
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={() => approveAnomaly(anomaly.id)}
              className="font-bold text-xs px-3 py-1 border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Aprobar
            </button>
            <button
              onClick={() => setCorrecting((v) => !v)}
              className="font-bold text-xs px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
            >
              <PenTool className="w-3 h-3" /> Corregir
            </button>
            <button
              onClick={() => discardAnomaly(anomaly.id)}
              className="font-bold text-xs px-3 py-1 border-2 border-black bg-red-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Descartar
            </button>
          </div>
        )}

        {/* Undo button for decided anomalies */}
        {!isPending && (
          <button
            onClick={handleUndo}
            className="ml-auto font-bold text-xs px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Deshacer
          </button>
        )}
      </div>

      {/* Inline correction input */}
      {correcting && isPending && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe la corrección..."
            autoFocus
            className="flex-1 border-2 border-black px-2 py-1 text-sm font-medium focus:outline-none focus:border-[#0033A0]"
          />
          <button
            onClick={handleConfirmCorrection}
            disabled={!inputValue.trim()}
            className="font-bold text-xs px-3 py-1 border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
          <button
            onClick={() => setCorrecting(false)}
            className="font-bold text-xs px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export function AnomalyGroupCard({ group }: Props) {
  const headerClass = getHeaderClass(group.type);

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Group header */}
      <div className={`${headerClass} border-b-2 border-black px-4 py-3 flex items-center justify-between`}>
        <div>
          <span className="font-black text-sm uppercase tracking-wide">
            {group.label}
          </span>
          <span className="ml-3 font-medium text-sm opacity-80">
            {group.anomalies.length} columna{group.anomalies.length !== 1 ? "s" : ""} afectada{group.anomalies.length !== 1 ? "s" : ""}
            {" · "}
            {group.totalRows} fila{group.totalRows !== 1 ? "s" : ""} en total
          </span>
        </div>
      </div>

      {/* Anomaly rows */}
      <div>
        {group.anomalies.map((anomaly) => (
          <AnomalyRow key={anomaly.id} anomaly={anomaly} />
        ))}
      </div>
    </div>
  );
}
