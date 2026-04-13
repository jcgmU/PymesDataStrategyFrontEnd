'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useStats } from '@/hooks/useStats'
import { cn } from '@/lib/utils'

function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string | number
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-[10px] p-5",
        "shadow-[0_1px_3px_rgba(0,0,0,.08)]",
        "border-l-4",
        accent ? "border-[#ff6600]" : "border-[#059669]"
      )}
    >
      <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#1e293b]">{value}</p>
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.08)] p-5 animate-pulse h-24"
          />
        ))}
      </div>
    </div>
  )
}

function formatTime(ms: number | undefined | null): string {
  if (ms == null || isNaN(ms) || ms === 0) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export function MetricsBand() {
  const { data, isLoading, isError } = useStats()

  console.log('MetricsBand data received from hook:', data)

  if (isLoading) return <MetricsSkeleton />

  if (isError || !data) {
    return (
      <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.08)] p-4 text-center text-red-600 font-medium">
        No se pudieron cargar las métricas.
      </div>
    )
  }

  const chartData = [
    { name: 'Completados', value: data.jobsCompleted, color: '#16a34a' },
    { name: 'Fallidos', value: data.jobsFailed, color: '#dc2626' },
  ]

  return (
    <div className="space-y-4 mb-8">
      {/* Título sección */}
      <h3 className="text-base font-semibold text-[#1e293b]">
        Métricas del Sistema
      </h3>

      {/* Tarjetas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Datasets" value={data.totalDatasets} accent />
        <MetricCard label="Total Jobs" value={data.totalJobs} accent />
        <MetricCard label="Jobs Completados" value={data.jobsCompleted} />
        <MetricCard label="Jobs Fallidos" value={data.jobsFailed} />
        <MetricCard label="Tiempo Promedio" value={formatTime(data.avgProcessingTimeMs)} />
        <MetricCard label="Revisiones Pendientes" value={data.pendingReviews} />
      </div>

      {/* Chart Jobs */}
      <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.08)] p-4">
        <p className="text-sm font-semibold text-[#1e293b] mb-3">Jobs ETL — Completados vs Fallidos</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(value) => [value as number, 'Jobs']}
              contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}
            />
            <Bar dataKey="value" radius={4}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
