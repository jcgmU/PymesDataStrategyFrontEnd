"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { apiClient } from "@/lib/api-client"

interface ReportResponse {
  stats: {
    totalAnomalies: number
    approved: number
    corrected: number
    discarded: number
    pending: number
    byType: Record<string, { count: number; action: string }>
    datasetName: string
  }
  narrative: string
}

interface Props {
  datasetId: string
  datasetName: string
  onClose: () => void
}

const TYPE_LABELS: Record<string, string> = {
  MISSING_VALUE: "Valores faltantes",
  DUPLICATE: "Duplicados",
  FORMAT_INVALID: "Formato inválido",
  OUTLIER: "Valores atípicos",
  INCONSISTENT: "Inconsistentes",
  WHITESPACE_ONLY: "Espacios vacíos",
  SUSPICIOUS_PLACEHOLDER: "Marcadores",
  LEADING_TRAILING_WHITESPACE: "Espacios al inicio/fin",
  DATE_LOGICAL: "Fechas incoherentes",
  NUMERIC_ROUND_NUMBER: "Números redondos",
  LOW_VARIANCE: "Baja variación",
  OUTLIER_IQR: "Outliers IQR",
  SEQUENCE_GAP: "Huecos en secuencia",
  CROSS_FIELD_SWAP: "Campo incorrecto",
}

const ACTION_LABELS: Record<string, string> = {
  APPROVED: "Aprobadas",
  CORRECTED: "Corregidas",
  DISCARDED: "Eliminadas",
  PENDING: "Pendientes",
}

export function ReportModal({ datasetId, datasetName, onClose }: Props) {
  const { data: session } = useSession()
  const [report, setReport] = useState<ReportResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.post<{ success: boolean; data: ReportResponse }>(
        `/api/v1/datasets/${datasetId}/report`,
        {},
        session?.accessToken ?? undefined
      )
      setReport(result.data)
    } catch (e) {
      setError("No se pudo generar el informe. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReport() }, [datasetId])

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl flex flex-col my-auto max-h-[90vh]">
        {/* Header — fijo en la parte superior del modal */}
        <div className="bg-[#0033A0] text-white p-4 flex justify-between items-center border-b-2 border-black flex-shrink-0 sticky top-0 z-10">
          <h2 className="text-xl font-black uppercase">
            📊 Informe de Calidad — {datasetName}
          </h2>
          <button
            onClick={onClose}
            className="text-white font-black text-2xl hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 animate-pulse border-2 border-black"
                />
              ))}
              <p className="text-sm text-gray-500 text-center font-medium">
                Generando informe con Gemini...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 font-bold mb-4">{error}</p>
              <button
                onClick={fetchReport}
                className="border-2 border-black bg-white px-4 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100"
              >
                Reintentar
              </button>
            </div>
          )}

          {report && (
            <div className="space-y-6">
              {/* Estadísticas principales */}
              <div>
                <h3 className="font-black uppercase text-sm tracking-wider mb-3 border-b-2 border-black pb-1">
                  Resumen Estadístico
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Total", value: report.stats.totalAnomalies, color: "bg-gray-100" },
                    { label: "Aprobadas", value: report.stats.approved, color: "bg-green-100" },
                    { label: "Corregidas", value: report.stats.corrected, color: "bg-blue-100" },
                    { label: "Eliminadas", value: report.stats.discarded, color: "bg-red-100" },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className={`${color} border-2 border-black p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                    >
                      <p className="text-2xl font-black">{value}</p>
                      <p className="text-xs font-bold uppercase">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por tipo */}
              {Object.keys(report.stats.byType).length > 0 && (
                <div>
                  <h3 className="font-black uppercase text-sm tracking-wider mb-3 border-b-2 border-black pb-1">
                    Cambios por Tipo
                  </h3>
                  <div className="space-y-1">
                    {Object.entries(report.stats.byType).map(([type, data]) => (
                      <div
                        key={type}
                        className="flex justify-between items-center py-1 border-b border-gray-200"
                      >
                        <span className="font-medium text-sm">
                          {TYPE_LABELS[type] ?? type}
                        </span>
                        <div className="flex gap-2 text-sm">
                          <span className="font-bold">{data.count}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-gray-600">
                            {ACTION_LABELS[data.action] ?? data.action}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Narrativa Gemini */}
              <div>
                <h3 className="font-black uppercase text-sm tracking-wider mb-3 border-b-2 border-black pb-1">
                  Análisis IA (Gemini)
                </h3>
                <div className="bg-gray-50 border-2 border-black p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {report.narrative}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
