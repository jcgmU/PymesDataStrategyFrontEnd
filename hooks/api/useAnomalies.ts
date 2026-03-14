import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import { API_ENDPOINTS } from '@/lib/api-endpoints'
import type {
  ApiAnomaly,
  SubmitDecisionsDto,
  SubmitDecisionsResponse,
} from '@/types/api'

const ANOMALIES_KEY = 'anomalies'

/**
 * Fetch all anomalies for a given dataset.
 * GET /api/v1/datasets/:datasetId/anomalies
 */
export function useAnomalies(datasetId: string) {
  const { data: session } = useSession()
  const token = session?.accessToken ?? undefined
  return useQuery<{ success: boolean; data: ApiAnomaly[] }>({
    queryKey: [ANOMALIES_KEY, datasetId, token],
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.anomalies.list(datasetId), token),
    enabled: !!datasetId && !!token,
  })
}

/**
 * Submit human decisions for anomalies in a dataset (HITL flow).
 * POST /api/v1/datasets/:datasetId/decisions
 */
export function useSubmitDecisions(datasetId: string) {
  const { data: session } = useSession()
  const token = session?.accessToken ?? undefined
  const queryClient = useQueryClient()
  return useMutation<
    { success: boolean; data: SubmitDecisionsResponse },
    Error,
    SubmitDecisionsDto
  >({
    mutationFn: (dto: SubmitDecisionsDto) =>
      apiClient.post(
        API_ENDPOINTS.anomalies.submitDecisions(datasetId),
        dto,
        token
      ),
    onSuccess: () => {
      // Invalidate anomalies cache so the list refreshes
      queryClient.invalidateQueries({ queryKey: [ANOMALIES_KEY, datasetId] })
    },
  })
}
