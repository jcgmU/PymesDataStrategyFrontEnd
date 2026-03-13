import type { Dataset } from "@/types";
import { DATASET_STATUS } from "@/types";

export const mockDatasets: Dataset[] = [
  {
    id: "ds-001",
    name: "Ventas_2025",
    originalName: "Ventas_2025.xlsx",
    rowCount: 1500,
    columnCount: 12,
    fileSize: 245760,
    status: DATASET_STATUS.COMPLETED,
    progress: 100,
    anomalyCount: 0,
    createdAt: "2025-03-10T14:30:00Z",
    updatedAt: "2025-03-10T15:45:00Z",
  },
  {
    id: "ds-002",
    name: "Nomina",
    originalName: "Nomina.xlsx",
    rowCount: 850,
    columnCount: 18,
    fileSize: 184320,
    status: DATASET_STATUS.AWAITING_REVIEW,
    progress: 100,
    anomalyCount: 12,
    createdAt: "2025-03-11T09:15:00Z",
    updatedAt: "2025-03-11T10:20:00Z",
  },
  {
    id: "ds-003",
    name: "Clientes_Q1",
    originalName: "Clientes_Q1.csv",
    rowCount: 2300,
    columnCount: 15,
    fileSize: 512000,
    status: DATASET_STATUS.PROCESSING,
    progress: 65,
    anomalyCount: 0,
    createdAt: "2025-03-12T08:00:00Z",
    updatedAt: "2025-03-12T08:45:00Z",
  },
];
