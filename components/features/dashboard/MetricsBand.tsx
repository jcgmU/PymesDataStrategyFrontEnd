'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useStats } from '@/hooks/useStats'

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
      className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 ${
        accent ? 'bg-[#0033A0] text-white' : 'bg-white'
      }`}
    >
      <p className={`text-xs font-bold uppercase tracking-wider ${accent ? 'text-blue-200' : 'text-gray-500'}`}>
        {label}
      </p>
      <p className="text-3xl font-black mt-1">{value}</p>
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
            className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 bg-gray-100 animate-pulse h-24"
          />
        ))}
      </div>
    </div>
  )
}

function formatTime(ms: number): string {
  if (ms === 0) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export function MetricsBand() {
  const { data, isLoading, isError } = useStats()

  if (isLoading) return <MetricsSkeleton />

  if (isError || !data) {
    return (
      <div className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 bg-white text-center text-red-600 font-medium">
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
      <h3 className="text-xl font-bold uppercase border-b-2 border-black pb-2">
        Métricas del Sistema
      </h3>

      {/* Tarjetas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Datasets" value={data.totalDatasets} accent />
        <MetricCard label="Este Mes" value={data.datasetsThisMonth} />
        <MetricCard label="Jobs Completados" value={data.jobsCompleted} />
        <MetricCard label="Jobs Fallidos" value={data.jobsFailed} />
        <MetricCard label="Tiempo Promedio" value={formatTime(data.avgProcessingTimeMs)} />
        <MetricCard label="Revisiones Pendientes" value={data.pendingReviews} />
      </div>

      {/* Chart Jobs */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
        <p className="text-sm font-bold uppercase mb-3">Jobs ETL — Completados vs Fallidos</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 'bold' }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [value, 'Jobs']}
              contentStyle={{ border: '2px solid black', borderRadius: 0 }}
            />
            <Bar dataKey="value" radius={0}>
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
