import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { FileDropzone } from '@/components/features/dashboard/FileDropzone'
import { useAppStore } from '@/store'
import { uploadDataset } from '@/services'

// Mock services
vi.mock('@/services', () => ({
  uploadDataset: vi.fn()
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  UploadCloud: () => <span data-testid="upload-icon">UploadCloud Icon</span>
}))

describe('FileDropzone', () => {
  const mockUploadDataset = vi.mocked(uploadDataset)

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    useAppStore.setState({
      isUploading: false,
      uploadProgress: 0,
      datasets: []
    })
  })

  test('should render upload instructions', () => {
    // Arrange & Act
    render(<FileDropzone />)

    // Assert
    expect(screen.getByText('Arrastra tu Excel aquí')).toBeInTheDocument()
    expect(screen.getByText('Máximo 50,000 registros (.xlsx)')).toBeInTheDocument()
    expect(screen.getByText('Seleccionar Archivo')).toBeInTheDocument()
  })

  test('should show dragover state when dragging file over', () => {
    // Arrange
    render(<FileDropzone />)
    // Get the dropzone container (the one with border-dashed class)
    const dropzone = document.querySelector('.border-dashed')!

    // Act
    fireEvent.dragOver(dropzone)

    // Assert
    expect(dropzone).toHaveClass('border-solid')
    expect(dropzone).toHaveClass('bg-orange-100')
  })

  test('should validate file extension on drop and reject .pdf', async () => {
    // Arrange
    render(<FileDropzone />)
    const dropzone = screen.getByText('Arrastra tu Excel aquí').closest('div')!
    
    const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' })
    const dataTransfer = {
      files: [invalidFile],
      items: [{ kind: 'file', type: 'application/pdf', getAsFile: () => invalidFile }],
      types: ['Files']
    }

    // Act
    fireEvent.drop(dropzone, { dataTransfer })

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Formato no válido. Solo se aceptan archivos CSV, XLSX o XLS.')).toBeInTheDocument()
    })
    expect(mockUploadDataset).not.toHaveBeenCalled()
  })

  test('should validate file size on drop and reject files > 10MB', async () => {
    // Arrange
    render(<FileDropzone />)
    const dropzone = screen.getByText('Arrastra tu Excel aquí').closest('div')!
    
    // Create a mock file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.csv', { type: 'text/csv' })
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 })
    
    const dataTransfer = {
      files: [largeFile],
      items: [{ kind: 'file', type: 'text/csv', getAsFile: () => largeFile }],
      types: ['Files']
    }

    // Act
    fireEvent.drop(dropzone, { dataTransfer })

    // Assert
    await waitFor(() => {
      expect(screen.getByText('El archivo excede el tamaño máximo de 10MB.')).toBeInTheDocument()
    })
    expect(mockUploadDataset).not.toHaveBeenCalled()
  })

  test('should call uploadDataset service on valid file drop', async () => {
    // Arrange
    const mockDataset = {
      id: 'ds-123',
      name: 'test',
      originalName: 'test.csv',
      rowCount: 100,
      columnCount: 5,
      fileSize: 1024,
      status: 'PENDING' as const,
      progress: 0,
      anomalyCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockUploadDataset.mockResolvedValue(mockDataset)

    render(<FileDropzone />)
    const dropzone = screen.getByText('Arrastra tu Excel aquí').closest('div')!
    
    const validFile = new File(['col1,col2\nval1,val2'], 'test.csv', { type: 'text/csv' })
    const dataTransfer = {
      files: [validFile],
      items: [{ kind: 'file', type: 'text/csv', getAsFile: () => validFile }],
      types: ['Files']
    }

    // Act
    fireEvent.drop(dropzone, { dataTransfer })

    // Assert
    await waitFor(() => {
      expect(mockUploadDataset).toHaveBeenCalledWith(validFile)
    })
  })

  test('should update store isUploading state during upload', async () => {
    // Arrange
    const mockDataset = {
      id: 'ds-123',
      name: 'test',
      originalName: 'test.csv',
      rowCount: 100,
      columnCount: 5,
      fileSize: 1024,
      status: 'PENDING' as const,
      progress: 0,
      anomalyCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Make uploadDataset return a promise that we can control
    mockUploadDataset.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve(mockDataset), 100)
    }))

    render(<FileDropzone />)
    const dropzone = screen.getByText('Arrastra tu Excel aquí').closest('div')!
    
    const validFile = new File(['col1,col2\nval1,val2'], 'test.csv', { type: 'text/csv' })
    const dataTransfer = {
      files: [validFile],
      items: [{ kind: 'file', type: 'text/csv', getAsFile: () => validFile }],
      types: ['Files']
    }

    // Act
    fireEvent.drop(dropzone, { dataTransfer })

    // Assert - should show uploading state
    await waitFor(() => {
      expect(useAppStore.getState().isUploading).toBe(true)
    })
  })

  test('should show progress bar when uploading', async () => {
    // Arrange
    useAppStore.setState({ isUploading: true, uploadProgress: 50 })

    // Act
    render(<FileDropzone />)

    // Assert
    expect(screen.getByText('Subiendo archivo...')).toBeInTheDocument()
  })
})
