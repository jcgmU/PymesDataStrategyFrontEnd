"use client";

import { useState } from "react";
import { Check, X, PenTool, Sparkles, Loader2 } from "lucide-react";
import { useReviewStore } from "@/store";
import { ANOMALY_TYPE, REVIEW_ACTION } from "@/types";
import type { Anomaly, AnomalyType } from "@/types";
import type { IRCorrection, PreviewResult, PreviewError } from "@/types/ir";
import { useSession } from "next-auth/react";

// ── Helpers reutilizados del AnomalyCard original ──────────────────────────

function isPlausibleAiValue(v: string | null | undefined): v is string {
  if (v === null || v === undefined) return false;
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (t.length === 0 || t.length > 80) return false;
  const lower = t.toLowerCase();
  const instructionVerbs = [
    "asigna", "asignar", "rellena", "rellenar", "elimina", "eliminar",
    "imputa", "imputar", "borra", "borrar", "reempla", "corrige", "corregir",
    "sugier", "usa la media", "usa la moda", "usa la mediana",
  ];
  if (instructionVerbs.some((w) => lower.includes(w))) return false;
  return true;
}

function isLiteralText(text: string): boolean {
  const t = text.trim();
  if (/^-?\d+(\.\d+)?$/.test(t)) return true;
  if (t.toLowerCase() === "null") return true;
  if (/^".+"$/.test(t) || /^'.+'$/.test(t)) return true;
  return false;
}

function buildLiteralIRCorrection(text: string): IRCorrection {
  const t = text.trim();
  let value: string | number | null;
  if (t.toLowerCase() === "null") {
    value = null;
  } else if (/^-?\d+(\.\d+)?$/.test(t)) {
    value = Number(t);
  } else {
    value = t.slice(1, -1);
  }
  return { ir: { op: "FILL_LITERAL", value }, irSource: "rule", irRawText: text.trim() };
}

const ANOMALY_DESCRIPTIONS: Record<AnomalyType, (rows: number) => string> = {
  [ANOMALY_TYPE.FILL_NULLS]: (rows) => `Se detectaron ${rows} valores nulos (celdas vacías).`,
  [ANOMALY_TYPE.REMOVE_DUPLICATES]: (rows) => `${rows} registros duplicados encontrados.`,
  [ANOMALY_TYPE.TRIM_WHITESPACE]: (rows) => `${rows} celdas con espacios en blanco innecesarios.`,
  [ANOMALY_TYPE.FIX_DATE_FORMAT]: (rows) => `${rows} fechas con formato inconsistente.`,
  [ANOMALY_TYPE.NORMALIZE_CASE]: (rows) => `${rows} valores con capitalización inconsistente.`,
  [ANOMALY_TYPE.REMOVE_OUTLIERS]: (rows) => `${rows} valores atípicos (outliers) detectados.`,
  [ANOMALY_TYPE.FIX_PHONE_FORMAT]: (rows) => `${rows} teléfonos con formato irregular.`,
  [ANOMALY_TYPE.VALIDATE_EMAIL]: (rows) => `${rows} emails con formato inválido.`,
  [ANOMALY_TYPE.STANDARDIZE_ADDRESS]: (rows) => `${rows} direcciones sin estandarizar.`,
  [ANOMALY_TYPE.FIX_CURRENCY]: (rows) => `${rows} valores monetarios con formato inconsistente.`,
  [ANOMALY_TYPE.MERGE_COLUMNS]: (rows) => `${rows} registros candidatos para fusión de columnas.`,
};

type PreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: PreviewResult }
  | { status: "error"; error: PreviewError };

interface Props {
  anomaly: Anomaly;
  onClose: () => void;
}

export function AnomalyDetailModal({ anomaly, onClose }: Props) {
  const approveAnomaly = useReviewStore((s) => s.approveAnomaly);
  const discardAnomaly = useReviewStore((s) => s.discardAnomaly);
  const correctAnomaly = useReviewStore((s) => s.correctAnomaly);
  const previewInstruction = useReviewStore((s) => s.previewInstruction);
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? undefined;

  const [editingAi, setEditingAi] = useState(false);
  const initialEditSeed = isPlausibleAiValue(anomaly.aiActionValue)
    ? anomaly.aiActionValue
    : isPlausibleAiValue(anomaly.suggestedFix)
      ? anomaly.suggestedFix
      : "";
  const [editValue, setEditValue] = useState(initialEditSeed);
  const [aiDismissed, setAiDismissed] = useState(false);
  const [editingManual, setEditingManual] = useState(false);
  const manualSeed = anomaly.userCorrectionText ?? anomaly.userCorrection ?? "";
  const [manualValue, setManualValue] = useState(manualSeed);
  const [previewState, setPreviewState] = useState<PreviewState>({ status: "idle" });

  const isPending = anomaly.action === REVIEW_ACTION.PENDING;
  const description = ANOMALY_DESCRIPTIONS[anomaly.type]?.(anomaly.affectedRows)
    ?? `${anomaly.affectedRows} fila(s) afectadas.`;

  const isNonEmptyNonLiteral = manualValue.trim().length > 0 && !isLiteralText(manualValue);

  const handleVistaPrevia = async () => {
    setPreviewState({ status: "loading" });
    try {
      const result = await previewInstruction(anomaly.id, manualValue.trim(), anomaly.datasetId, accessToken);
      if ("error" in result) {
        setPreviewState({ status: "error", error: result as PreviewError });
      } else {
        setPreviewState({ status: "success", result: result as PreviewResult });
      }
    } catch {
      setPreviewState({
        status: "error",
        error: { error: "gemini_unavailable", message: "No pudimos interpretar la instrucción. Inténtalo de nuevo.", canRetry: true },
      });
    }
  };

  const handleApplyLiteral = () => {
    correctAnomaly(anomaly.id, buildLiteralIRCorrection(manualValue));
    onClose();
  };

  const handleApplyFromPreview = (result: PreviewResult) => {
    correctAnomaly(anomaly.id, { ir: result.ir, irSource: result.source, irRawText: manualValue.trim() });
    onClose();
  };

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
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0033A0] text-white px-4 py-3 flex items-center justify-between border-b-2 border-black">
          <div>
            <span className="text-xs font-bold uppercase opacity-75">Anomalía</span>
            <p className="font-black text-lg">Columna: {anomaly.column}</p>
          </div>
          <button onClick={onClose} className="text-white font-black text-xl hover:opacity-70 transition-opacity">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Descripción */}
          <div>
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">Anomalía Detectada</p>
            <p className="font-bold text-base">{description}</p>
            {anomaly.sampleValues?.[0] && (
              <p className="text-sm text-gray-500 mt-1">
                Ejemplo: <span className="italic font-medium">&ldquo;{anomaly.sampleValues[0]}&rdquo;</span>
              </p>
            )}
          </div>

          {/* Sugerencia básica si no hay Gemini */}
          {!anomaly.aiSuggestion && (
            <div className="bg-blue-50 p-3 border-l-4 border-[#0033A0]">
              <p className="text-xs font-bold uppercase text-[#0033A0] mb-1">Sugerencia</p>
              <p className="font-medium text-sm">{anomaly.suggestedFix}</p>
            </div>
          )}

          {/* Panel Gemini AI */}
          {anomaly.aiSuggestion && isPending && !aiDismissed && (
            <div className="bg-purple-50 p-3 border-l-4 border-purple-500">
              <p className="text-xs font-bold uppercase text-purple-700 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini AI
              </p>
              {editingAi ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    className="w-full border-2 border-black px-2 py-1 text-sm font-medium focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { if (editValue.trim()) { correctAnomaly(anomaly.id, editValue.trim()); onClose(); } }}
                      className="text-xs font-bold px-3 py-1 border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      Aplicar
                    </button>
                    <button
                      onClick={() => { setEditingAi(false); setEditValue(initialEditSeed); }}
                      className="text-xs font-bold px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-medium text-sm mb-2">{anomaly.aiSuggestion}</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        if (anomaly.aiActionType === "DELETE") {
                          discardAnomaly(anomaly.id); onClose();
                        } else if (anomaly.aiActionType === "FILL") {
                          if (isPlausibleAiValue(anomaly.aiActionValue)) {
                            correctAnomaly(anomaly.id, anomaly.aiActionValue); onClose();
                          } else {
                            setEditValue(isPlausibleAiValue(anomaly.suggestedFix) ? anomaly.suggestedFix : "");
                            setEditingAi(true);
                          }
                        } else {
                          approveAnomaly(anomaly.id); onClose();
                        }
                      }}
                      className="text-xs font-bold px-3 py-1 border-2 border-black bg-purple-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Aceptar IA
                    </button>
                    <button
                      onClick={() => setAiDismissed(true)}
                      className="text-xs font-bold px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Rechazar
                    </button>
                    <button
                      onClick={() => { setEditValue(initialEditSeed); setEditingAi(true); }}
                      className="text-xs font-bold px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1"
                    >
                      <PenTool className="w-3 h-3" /> Editar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Edición manual con NL Edit + Vista Previa */}
          {isPending && editingManual && (
            <div className="space-y-2 border-2 border-black p-3 bg-gray-50">
              <p className="text-xs font-bold uppercase text-gray-600 mb-1">Editar corrección</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualValue}
                  onChange={(e) => { setManualValue(e.target.value); setPreviewState({ status: "idle" }); }}
                  placeholder="Escribe tu corrección o instrucción en español..."
                  autoFocus
                  className="flex-1 border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#0033A0]"
                />
                {isNonEmptyNonLiteral && (
                  <button
                    onClick={handleVistaPrevia}
                    disabled={previewState.status === "loading"}
                    className="font-bold py-2 px-3 border-2 border-black bg-[#0033A0] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-xs disabled:opacity-60 flex items-center gap-1 whitespace-nowrap"
                  >
                    {previewState.status === "loading"
                      ? <><Loader2 className="w-3 h-3 animate-spin" /> Analizando...</>
                      : "Vista previa"}
                  </button>
                )}
              </div>

              {/* Preview éxito */}
              {previewState.status === "success" && (
                <div className="border-2 border-black p-3 bg-white space-y-2">
                  <p className="text-sm font-medium">{previewState.result.preview.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {previewState.result.source === "rule" ? (
                      <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-800 border border-green-400 rounded">⚡ Regla directa</span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-400 rounded">🤖 Interpretado por IA</span>
                    )}
                    <span className="text-xs text-gray-500">{previewState.result.preview.affectedRows} fila(s) afectada(s)</span>
                  </div>
                  {previewState.result.source === "rule" && !previewState.result.preview.requiresConfirmation ? (
                    <button onClick={() => handleApplyFromPreview(previewState.result)} className="font-bold py-1 px-4 border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-sm">
                      Aplicar
                    </button>
                  ) : (
                    <button onClick={() => handleApplyFromPreview(previewState.result)} className="font-bold py-1 px-4 border-2 border-black bg-purple-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-sm">
                      Confirmar
                    </button>
                  )}
                </div>
              )}

              {/* Preview error — gemini_unavailable */}
              {previewState.status === "error" && previewState.error.error === "gemini_unavailable" && (
                <div className="border-2 border-red-500 bg-red-50 p-3 flex flex-col gap-2">
                  <p className="text-sm font-medium text-red-700">{previewState.error.message}</p>
                  <button onClick={handleVistaPrevia} className="self-start text-xs font-bold px-3 py-1 border-2 border-red-600 bg-white text-red-700 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Reintentar</button>
                </div>
              )}

              {/* Preview error — invalid_instruction */}
              {previewState.status === "error" && previewState.error.error === "invalid_instruction" && (
                <div className="border-2 border-orange-500 bg-orange-50 p-3">
                  <p className="text-sm font-medium text-orange-700">{previewState.error.message}</p>
                </div>
              )}

              <div className="flex gap-2">
                {!isNonEmptyNonLiteral && manualValue.trim().length > 0 && (
                  <button onClick={handleApplyLiteral} className="flex-1 font-bold py-2 border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-sm">
                    Aplicar corrección
                  </button>
                )}
                <button onClick={() => { setEditingManual(false); setPreviewState({ status: "idle" }); }} className="font-bold py-2 px-4 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Botones principales */}
          <div className="pt-2 space-y-2">
            {isPending && !editingManual ? (
              <>
                <button
                  onClick={() => { approveAnomaly(anomaly.id); onClose(); }}
                  className="w-full font-bold py-2 border-2 border-black bg-green-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Aprobar
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setManualValue(anomaly.userCorrectionText ?? anomaly.userCorrection ?? ""); setPreviewState({ status: "idle" }); setEditingManual(true); }}
                    className="font-bold py-2 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <PenTool className="w-4 h-4" /> Editar
                  </button>
                  <button
                    onClick={() => { discardAnomaly(anomaly.id); onClose(); }}
                    className="font-bold py-2 border-2 border-black bg-red-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <X className="w-4 h-4" /> Descartar
                  </button>
                </div>
              </>
            ) : !isPending ? (
              <button onClick={handleUndo} className="w-full font-bold py-2 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                Deshacer Acción
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
