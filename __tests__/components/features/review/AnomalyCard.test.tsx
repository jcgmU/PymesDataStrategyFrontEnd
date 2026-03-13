import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnomalyCard } from '@/components/features/review/AnomalyCard'
import { useReviewStore } from '@/store'
import { ANOMALY_TYPE, REVIEW_ACTION } from '@/types'
import type { Anomaly } from '@/types'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">Check</span>,
  X: () => <span data-testid="x-icon">X</span>,
  PenTool: () => <span data-testid="pen-icon">PenTool</span>,
  CheckCircle2: () => <span data-testid="check-circle-icon">CheckCircle2</span>,
}))

const createMockAnomaly = (overrides?: Partial<Anomaly>): Anomaly => ({
  id: 'anomaly-1',
  datasetId: 'ds-1',
  type: ANOMALY_TYPE.FILL_NULLS,
  column: 'email',
  affectedRows: 150,
  sampleValues: ['', 'null', 'john@example.com'],
  suggestedFix: 'Rellenar con valor por defecto',
  confidence: 0.85,
  action: REVIEW_ACTION.PENDING,
  ...overrides
})

describe('AnomalyCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useReviewStore.setState({
      anomalies: [],
      currentAnomalyIndex: 0,
      isSubmitting: false
    })
  })

  test('should render column badge', () => {
    const anomaly = createMockAnomaly({ column: 'phone_number' })
    render(<AnomalyCard anomaly={anomaly} />)
    expect(screen.getByText('Columna: phone_number')).toBeInTheDocument()
  })

  test('should render anomaly description based on type and affected rows', () => {
    const anomaly = createMockAnomaly({
      type: ANOMALY_TYPE.FILL_NULLS,
      affectedRows: 150,
    })
    render(<AnomalyCard anomaly={anomaly} />)
    expect(screen.getByText('Se detectaron 150 valores nulos (celdas vacías).')).toBeInTheDocument()
  })

  test('should render AI suggestion', () => {
    const anomaly = createMockAnomaly({
      suggestedFix: 'Normalizar formato de fecha',
    })
    render(<AnomalyCard anomaly={anomaly} />)
    expect(screen.getByText('Normalizar formato de fecha')).toBeInTheDocument()
    expect(screen.getByText('Sugerencia IA')).toBeInTheDocument()
  })

  test('should render action buttons when pending', () => {
    const anomaly = createMockAnomaly()
    render(<AnomalyCard anomaly={anomaly} />)
    expect(screen.getByRole('button', { name: /aprobar regla/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /descartar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument()
  })

  test('should call approveAnomaly when Aprobar Regla clicked', async () => {
    const user = userEvent.setup()
    const anomaly = createMockAnomaly()
    const approveAnomalySpy = vi.fn()
    useReviewStore.setState({
      anomalies: [anomaly],
      approveAnomaly: approveAnomalySpy
    })

    render(<AnomalyCard anomaly={anomaly} />)
    await user.click(screen.getByRole('button', { name: /aprobar regla/i }))

    expect(approveAnomalySpy).toHaveBeenCalledWith('anomaly-1')
  })

  test('should call discardAnomaly when Descartar clicked', async () => {
    const user = userEvent.setup()
    const anomaly = createMockAnomaly()
    const discardAnomalySpy = vi.fn()
    useReviewStore.setState({
      anomalies: [anomaly],
      discardAnomaly: discardAnomalySpy
    })

    render(<AnomalyCard anomaly={anomaly} />)
    await user.click(screen.getByRole('button', { name: /descartar/i }))

    expect(discardAnomalySpy).toHaveBeenCalledWith('anomaly-1')
  })

  test('should show undo button and status icon when approved', () => {
    const anomaly = createMockAnomaly({ action: REVIEW_ACTION.APPROVED })
    render(<AnomalyCard anomaly={anomaly} />)
    expect(screen.getByRole('button', { name: /deshacer acción/i })).toBeInTheDocument()
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /aprobar regla/i })).not.toBeInTheDocument()
  })

  test('should show undo button and X icon when discarded', () => {
    const anomaly = createMockAnomaly({ action: REVIEW_ACTION.DISCARDED })
    render(<AnomalyCard anomaly={anomaly} />)
    expect(screen.getByRole('button', { name: /deshacer acción/i })).toBeInTheDocument()
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
  })

  test('should apply dimmed styles when not pending', () => {
    const anomaly = createMockAnomaly({ action: REVIEW_ACTION.APPROVED })
    const { container } = render(<AnomalyCard anomaly={anomaly} />)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('opacity-60')
  })

  test('should render description for REMOVE_DUPLICATES type', () => {
    const anomaly = createMockAnomaly({
      type: ANOMALY_TYPE.REMOVE_DUPLICATES,
      affectedRows: 42,
    })
    render(<AnomalyCard anomaly={anomaly} />)
    expect(screen.getByText('42 registros duplicados encontrados.')).toBeInTheDocument()
  })
})
