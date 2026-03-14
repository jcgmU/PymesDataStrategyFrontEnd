import { useEffect, useState, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/lib/api-endpoints'
import type { JobStatus } from '@/types/api'

const TERMINAL_STATUSES: JobStatus[] = ['COMPLETED', 'FAILED', 'CANCELLED']

interface SSEStatusEvent {
  jobId: string
  status: JobStatus
  error?: string
}

export interface UseJobSSEResult {
  status: JobStatus | undefined
  error: string | undefined
  isConnected: boolean
}

/**
 * Connects to GET /api/v1/jobs/:jobId/events (SSE) and streams real-time
 * job status updates. Automatically closes the connection when the job
 * reaches a terminal state (COMPLETED, FAILED, CANCELLED).
 *
 * Replaces the polling-based useJobStatus hook.
 */
export function useJobSSE(jobId: string | null): UseJobSSEResult {
  const [status, setStatus] = useState<JobStatus | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isConnected, setIsConnected] = useState(false)
  const queryClient = useQueryClient()
  // Keep a stable ref to avoid stale closures in EventSource handlers
  const jobIdRef = useRef(jobId)
  jobIdRef.current = jobId

  useEffect(() => {
    if (!jobId) {
      setStatus(undefined)
      setError(undefined)
      setIsConnected(false)
      return
    }

    const url = API_ENDPOINTS.jobs.events(jobId)
    const es = new EventSource(url)
    setIsConnected(true)

    es.addEventListener('status', (e: MessageEvent<string>) => {
      try {
        const data = JSON.parse(e.data) as SSEStatusEvent
        // Normalize lowercase (backend) → uppercase (frontend types)
        const normalized = data.status.toUpperCase() as JobStatus
        setStatus(normalized)
        if (data.error) setError(data.error)

        if (TERMINAL_STATUSES.includes(normalized)) {
          setIsConnected(false)
          es.close()

          // Invalidate relevant queries so UI refreshes automatically
          if (normalized === 'COMPLETED') {
            void queryClient.invalidateQueries({ queryKey: ['datasets'] })
            void queryClient.invalidateQueries({ queryKey: ['stats'] })
          }
        }
      } catch {
        // Malformed SSE data — ignore
      }
    })

    es.addEventListener('timeout', () => {
      setIsConnected(false)
      es.close()
    })

    es.addEventListener('error', () => {
      // SSE error / server closed — stop listening
      setIsConnected(false)
      es.close()
    })

    return () => {
      es.close()
      setIsConnected(false)
    }
  }, [jobId, queryClient])

  return { status, error, isConnected }
}
