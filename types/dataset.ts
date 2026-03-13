export const DATASET_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  AWAITING_REVIEW: "AWAITING_REVIEW",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type DatasetStatus =
  (typeof DATASET_STATUS)[keyof typeof DATASET_STATUS];

export interface Dataset {
  id: string;
  name: string;
  originalName: string;
  rowCount: number;
  columnCount: number;
  fileSize: number;
  status: DatasetStatus;
  progress: number;
  anomalyCount: number;
  createdAt: string;
  updatedAt: string;
}
