"use client";

import { Check, X, PenTool, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useReviewStore } from "@/store";
import { ANOMALY_TYPE, REVIEW_ACTION } from "@/types";
import type { Anomaly, AnomalyType } from "@/types";
import type { IRCorrection, PreviewResult, PreviewError } from "@/types/ir";
import { Card } from "@/components/ui/Card";
import { useSession } from "next-auth/react";

/**
 * Decide si un valor sugerido por la IA es aplicable directo a una celda.
 * Rechaza nulls, cadenas vacías, textos narrativos largos (Gemini a veces
 * devuelve instrucciones en el campo `value` en lugar del literal), y
 * frases con verbos típicos de instrucción ("asigna", "rellena", "elimina",
 * "imputa", etc.) que claramente no son valores.
 */
function isPlausibleAiValue(v: string | null | undefined): v is string {
  if (v === null || v === undefined) return false;
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (t.length === 0) return false;
  if (t.length > 80) return false;
  const lower = t.toLowerCase();
  const instructionVerbs = [
    "asigna", "asignar",
    "rellena", "rellenar",
    "elimina", "eliminar",
    "imputa", "imputar",
    "borra", "borrar",
    "reempla", // reemplaza/reemplazar
    "corrige", "corregir",
    "sugier", // sugiere/sugerir
    "usa la media", "usa la moda", "usa la mediana",
  ];
  if (instructionVerbs.some((w) => lower.includes(w))) return false;
  return true;
}

/**
 * Detects if the trimmed text is a "literal" that can be converted to a
 * FILL_LITERAL IR node locally without calling the backend.
 * Matches: numeric values, "null" (case-insensitive), quoted strings.
 */
function isLiteralText(text: string): boolean {
  const t = text.trim();
  if (/^-?\d+(\.\d+)?$/.test(t)) return true;
  if (t.toLowerCase() === "null") return true;
  if (/^".+"$/.test(t) || /^'.+'$/.test(t)) return true;
  return false;
}

/**
 * Build a local FILL_LITERAL IRCorrection from a literal text without calling the backend.
 */
function buildLiteralIRCorrection(text: string): IRCorrection {
  const t = text.trim();
  let value: string | number | null;
  if (t.toLowerCase() === "null") {
    value = null;
  } else if (/^-?\d+(\.\d+)?$/.test(t)) {
    value = Number(t);
  } else {
    // Quoted string — strip the quotes
    value = t.slice(1, -1);
  }
  return {
    ir: { op: "FILL_LITERAL", value },
    irSource: "rule",
    irRawText: text.trim(),
  };
}

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

type PreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: PreviewResult }
  | { status: "error"; error: PreviewError };

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
  const approveAnomaly = useReviewStore((s) => s.approveAnomaly);
  const discardAnomaly = useReviewStore((s) => s.discardAnomaly);
  const correctAnomaly = useReviewStore((s) => s.correctAnomaly);
  const previewInstruction = useReviewStore((s) => s.previewInstruction);
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? undefined;

  const [editingAi, setEditingAi] = useState(false);
  const initialEditSeed =
    isPlausibleAiValue(anomaly.aiActionValue)
      ? anomaly.aiActionValue
      : isPlausibleAiValue(anomaly.suggestedFix)
        ? anomaly.suggestedFix
        : "";
  const [editValue, setEditValue] = useState(initialEditSeed);
  const [aiDismissed, setAiDismissed] = useState(false);
  const [editingManual, setEditingManual] = useState(false);

  // Seed the manual input: prefer userCorrectionText (NL re-edit), else empty
  const manualSeed = anomaly.userCorrectionText ?? anomaly.userCorrection ?? "";
  const [manualValue, setManualValue] = useState(manualSeed);
  const [previewState, setPreviewState] = useState<PreviewState>({ status: "idle" });

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
        a.userCorrectionIr = null;
        a.userCorrectionText = null;
        a.userCorrectionSource = null;
      }
    });
  };

  const handleOpenManualEdit = () => {
    // Re-seed with NL text if available, else legacy correction or empty
    const seed = anomaly.userCorrectionText ?? anomaly.userCorrection ?? "";
    setManualValue(seed);
    setPreviewState({ status: "idle" });
    setEditingManual(true);
  };

  const isNonEmptyNonLiteral = manualValue.trim().length > 0 && !isLiteralText(manualValue);

  const handleVistaPrevia = async () => {
    setPreviewState({ status: "loading" });
    try {
      const result = await previewInstruction(
        anomaly.id,
        manualValue.trim(),
        anomaly.datasetId,
        accessToken
      );
      if ("error" in result) {
        setPreviewState({ status: "error", error: result as PreviewError });
      } else {
        setPreviewState({ status: "success", result: result as PreviewResult });
      }
    } catch {
      setPreviewState({
        status: "error",
        error: {
          error: "gemini_unavailable",
          message: "No pudimos interpretar la instrucción en este momento. Inténtalo nuevamente en unos segundos o usa una instrucción más simple.",
          canRetry: true,
        },
      });
    }
  };

  const handleApplyLiteral = () => {
    const irCorrection = buildLiteralIRCorrection(manualValue);
    correctAnomaly(anomaly.id, irCorrection);
    setEditingManual(false);
    setPreviewState({ status: "idle" });
  };

  const handleApplyFromPreview = (result: PreviewResult) => {
    const irCorrection: IRCorrection = {
      ir: result.ir,
      irSource: result.source,
      irRawText: manualValue.trim(),
    };
    correctAnomaly(anomaly.id, irCorrection);
    setEditingManual(false);
    setPreviewState({ status: "idle" });
  };

  const handleCancelManualEdit = () => {
    setEditingManual(false);
    setPreviewState({ status: "idle" });
  };

  const handleManualValueChange = (v: string) => {
    setManualValue(v);
    // Reset preview when input changes
    setPreviewState({ status: "idle" });
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
        {!anomaly.aiSuggestion && (
          <div className="bg-blue-50 p-3 border-l-4 border-[#0033A0]">
            <p className="text-xs font-bold uppercase text-[#0033A0] mb-1">
              Sugerencia IA
            </p>
            <p className="font-medium">{anomaly.suggestedFix}</p>
          </div>
        )}

        {/* Sugerencia Gemini — solo si está disponible y la anomalía está pendiente */}
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
                  className="w-full border-2 border-black px-2 py-1 text-sm font-medium focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (editValue.trim()) {
                        correctAnomaly(anomaly.id, editValue.trim());
                        setEditingAi(false);
                      }
                    }}
                    className="text-xs font-bold px-3 py-1 border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Aplicar
                  </button>
                  <button
                    onClick={() => {
                      setEditingAi(false);
                      const seed = isPlausibleAiValue(anomaly.aiActionValue)
                        ? anomaly.aiActionValue
                        : isPlausibleAiValue(anomaly.suggestedFix)
                          ? anomaly.suggestedFix
                          : "";
                      setEditValue(seed);
                    }}
                    className="text-xs font-bold px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
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
                      if (anomaly.aiActionType === 'DELETE') {
                        discardAnomaly(anomaly.id);
                      } else if (anomaly.aiActionType === 'FILL') {
                        // Solo auto-aplicar si el valor de Gemini es plausible;
                        // si no, abrir el editor para que el usuario lo revise/corrija
                        // (evita que una instrucción narrativa termine en la celda).
                        if (isPlausibleAiValue(anomaly.aiActionValue)) {
                          correctAnomaly(anomaly.id, anomaly.aiActionValue);
                        } else {
                          setEditValue(isPlausibleAiValue(anomaly.suggestedFix) ? anomaly.suggestedFix : "");
                          setEditingAi(true);
                        }
                      } else {
                        approveAnomaly(anomaly.id);
                      }
                    }}
                    className="text-xs font-bold px-3 py-1 border-2 border-black bg-purple-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Aceptar IA
                  </button>
                  <button
                    onClick={() => setAiDismissed(true)}
                    className="text-xs font-bold px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Rechazar
                  </button>
                  <button
                    onClick={() => {
                      const seed = isPlausibleAiValue(anomaly.aiActionValue)
                        ? anomaly.aiActionValue
                        : isPlausibleAiValue(anomaly.suggestedFix)
                          ? anomaly.suggestedFix
                          : "";
                      setEditValue(seed);
                      setEditingAi(true);
                    }}
                    className="text-xs font-bold px-3 py-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
                  >
                    <PenTool className="w-3 h-3" /> Editar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
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
            onClick={handleOpenManualEdit}
            className="font-bold py-2 px-6 border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 flex items-center justify-center gap-2"
          >
            <PenTool className="w-4 h-4" /> Editar
          </button>
          {editingManual && (
            <div className="col-span-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualValue}
                  onChange={(e) => handleManualValueChange(e.target.value)}
                  placeholder="Escribe tu corrección o instrucción en español..."
                  autoFocus
                  className="flex-1 border-2 border-black px-3 py-2 font-medium focus:outline-none focus:border-[#0033A0]"
                />
                {/* Vista previa — solo para instrucciones NL (no literales) */}
                {isNonEmptyNonLiteral && (
                  <button
                    onClick={handleVistaPrevia}
                    disabled={previewState.status === "loading"}
                    className="font-bold py-2 px-3 border-2 border-black bg-[#0033A0] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
                  >
                    {previewState.status === "loading" ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Analizando...
                      </>
                    ) : (
                      "Vista previa"
                    )}
                  </button>
                )}
              </div>

              {/* Panel de preview — éxito */}
              {previewState.status === "success" && (
                <div className="border-2 border-black p-3 space-y-2 bg-gray-50">
                  <p className="text-sm font-medium">{previewState.result.preview.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {previewState.result.source === "rule" ? (
                      <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-800 border border-green-400 rounded">
                        ⚡ Regla directa
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-400 rounded">
                        🤖 Interpretado por IA
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {previewState.result.preview.affectedRows} fila(s) afectada(s)
                    </span>
                  </div>
                  {/* Aplicar (rule directa) o Confirmar (gemini con requiresConfirmation) */}
                  {previewState.result.source === "rule" && !previewState.result.preview.requiresConfirmation ? (
                    <button
                      onClick={() => handleApplyFromPreview(previewState.result)}
                      className="font-bold py-1 px-4 border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
                    >
                      Aplicar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyFromPreview(previewState.result)}
                      className="font-bold py-1 px-4 border-2 border-black bg-purple-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
                    >
                      Confirmar
                    </button>
                  )}
                </div>
              )}

              {/* Panel de error — gemini_unavailable */}
              {previewState.status === "error" && previewState.error.error === "gemini_unavailable" && (
                <div className="border-2 border-red-500 bg-red-50 p-3 flex flex-col gap-2">
                  <p className="text-sm font-medium text-red-700">{previewState.error.message}</p>
                  <button
                    onClick={handleVistaPrevia}
                    className="self-start text-xs font-bold px-3 py-1 border-2 border-red-600 bg-white text-red-700 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(185,28,28,1)] transition-all"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Panel de error — invalid_instruction */}
              {previewState.status === "error" && previewState.error.error === "invalid_instruction" && (
                <div className="border-2 border-orange-500 bg-orange-50 p-3">
                  <p className="text-sm font-medium text-orange-700">{previewState.error.message}</p>
                </div>
              )}

              {/* Botones de acción del modo edición */}
              <div className="flex gap-2">
                {/* Aplicar directo solo para literales (no-NL) */}
                {!isNonEmptyNonLiteral && manualValue.trim().length > 0 && (
                  <button
                    onClick={handleApplyLiteral}
                    className="flex-1 font-bold py-2 border-2 border-black bg-green-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
                  >
                    Aplicar corrección
                  </button>
                )}
                <button
                  onClick={handleCancelManualEdit}
                  className="font-bold py-2 px-4 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
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
