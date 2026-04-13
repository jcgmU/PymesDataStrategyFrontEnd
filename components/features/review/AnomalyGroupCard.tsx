"use client";

import { useState } from "react";
import { Check, X, Sparkles, CheckCircle2, Eye } from "lucide-react";
import { useReviewStore } from "@/store";
import { REVIEW_ACTION } from "@/types";
import type { Anomaly } from "@/types";
import { AnomalyDetailModal } from "./AnomalyDetailModal";

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
  MISSING_VALUE:              "bg-[#fef3c7] text-[#92400e]",
  WHITESPACE_ONLY:            "bg-[#fef9c3] text-[#854d0e]",
  SUSPICIOUS_PLACEHOLDER:     "bg-[#fef9c3] text-[#854d0e]",
  LEADING_TRAILING_WHITESPACE:"bg-[#fefce8] text-[#713f12]",
  DUPLICATE:                  "bg-[#fee2e2] text-[#991b1b]",
  SEQUENCE_GAP:               "bg-[#fecaca] text-[#991b1b]",
  OUTLIER:                    "bg-[#fff0e6] text-[#c2410c]",
  NUMERIC_ROUND_NUMBER:       "bg-[#ffedd5] text-[#c2410c]",
  LOW_VARIANCE:               "bg-[#fff7ed] text-[#9a3412]",
  OUTLIER_IQR:                "bg-[#ffedd5] text-[#c2410c]",
  FORMAT_ERROR:               "bg-[#dbeafe] text-[#1e40af]",
  FORMAT_INVALID:             "bg-[#eff6ff] text-[#1d4ed8]",
  DATE_LOGICAL:               "bg-[#e0f2fe] text-[#0369a1]",
  INCONSISTENT:               "bg-[#f3e8ff] text-[#7e22ce]",
  CROSS_FIELD_SWAP:           "bg-[#ede9fe] text-[#6d28d9]",
};

function getHeaderClass(type: string): string {
  return TYPE_HEADER_COLORS[type] ?? "bg-[#f1f5f9] text-[#475569]";
}

function AnomalyRow({ anomaly }: { anomaly: Anomaly }) {
  const approveAnomaly = useReviewStore((s) => s.approveAnomaly);
  const discardAnomaly = useReviewStore((s) => s.discardAnomaly);
  const [modalOpen, setModalOpen] = useState(false);

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
  };

  const sampleValue = anomaly.sampleValues?.[0];
  const hasAiSuggestion = Boolean(anomaly.aiSuggestion);

  return (
    <>
      {modalOpen && (
        <AnomalyDetailModal anomaly={anomaly} onClose={() => setModalOpen(false)} />
      )}

      <div
        className={`border-b border-[#e2e8f0] last:border-0 py-3 px-4 ${isPending ? "hover:bg-[#f8fafc] cursor-pointer" : ""} transition-colors`}
        onClick={() => isPending && setModalOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Column badge */}
          <span className="bg-[#1e293b] text-white font-semibold text-xs px-2 py-1 rounded-md shrink-0">
            {anomaly.column}
          </span>

          {/* Row count + sample */}
          <span className="text-sm font-medium text-[#64748b] shrink-0">
            {anomaly.affectedRows} fila{anomaly.affectedRows !== 1 ? "s" : ""}
            {sampleValue ? (
              <span className="text-[#94a3b8] ml-1">
                · Ejemplo: <span className="italic">&ldquo;{sampleValue}&rdquo;</span>
              </span>
            ) : null}
          </span>

          {/* Badge IA */}
          {hasAiSuggestion && isPending && (
            <span className="flex items-center gap-1 bg-purple-100 text-purple-700 font-semibold text-xs px-2 py-0.5 border border-purple-300 rounded-full">
              <Sparkles className="w-3 h-3" /> IA lista
            </span>
          )}

          {/* Status badges */}
          {isApproved && (
            <span className="ml-auto flex items-center gap-1 bg-[#d1fae5] text-[#059669] font-semibold text-xs px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3 h-3" /> Aprobada
            </span>
          )}
          {isDiscarded && (
            <span className="ml-auto flex items-center gap-1 bg-[#fee2e2] text-[#dc2626] font-semibold text-xs px-2 py-1 rounded-md">
              <X className="w-3 h-3" /> Descartada
            </span>
          )}
          {isCorrected && (
            <span className="ml-auto flex items-center gap-1 bg-[#dbeafe] text-[#1d4ed8] font-semibold text-xs px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3 h-3" /> Corregida
            </span>
          )}

          {/* Quick action buttons */}
          {isPending && (
            <div className="ml-auto flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => approveAnomaly(anomaly.id)}
                title="Aprobar"
                className="font-semibold text-xs px-3 py-1 rounded-lg bg-[#059669] text-white hover:bg-[#047857] transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Aprobar
              </button>
              <button
                onClick={() => setModalOpen(true)}
                title="Ver detalle y gestionar con IA"
                className="font-semibold text-xs px-3 py-1 rounded-lg bg-[#ff6600] text-white hover:bg-[#cc5200] transition-colors flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> Gestionar
              </button>
              <button
                onClick={() => discardAnomaly(anomaly.id)}
                title="Descartar"
                className="font-semibold text-xs px-3 py-1 rounded-lg bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Descartar
              </button>
            </div>
          )}

          {/* Undo */}
          {!isPending && (
            <button
              onClick={(e) => { e.stopPropagation(); handleUndo(); }}
              className="ml-auto font-semibold text-xs px-3 py-1 rounded-lg border border-[#e2e8f0] bg-white text-[#1e293b] hover:bg-[#f8fafc] transition-colors"
            >
              Deshacer
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export function AnomalyGroupCard({ group }: Props) {
  const headerClass = getHeaderClass(group.type);

  return (
    <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.08)] overflow-hidden border border-[#e2e8f0]">
      {/* Group header */}
      <div className={`${headerClass} border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between`}>
        <div>
          <span className="font-semibold text-sm tracking-wide">
            {group.label}
          </span>
          <span className="ml-3 font-medium text-sm opacity-70">
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
