import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { API_ENDPOINTS } from '@/lib/api-endpoints'
import { useAuth } from '@/hooks/useAuth'

export interface StatsResponse {
  totalDatasets: number
  datasetsThisMonth: number
  jobsCompleted: number
  jobsFailed: number
  avgProcessingTimeMs: number
  pendingReviews: number
}

export function useStats() {
  const { accessToken } = useAuth()

  return useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: () =>
      apiClient.get<StatsResponse>(API_ENDPOINTS.stats.list(), accessToken ?? undefined),
    staleTime: 30_000, // 30 segundos
  })
}
