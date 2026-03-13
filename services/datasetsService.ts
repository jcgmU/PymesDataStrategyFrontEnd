import type { Dataset } from "@/types";
import { DATASET_STATUS } from "@/types";
import { mockDatasets } from "@/data";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getDatasets(): Promise<Dataset[]> {
  await delay(500);
  return [...mockDatasets];
}

export async function getDataset(id: string): Promise<Dataset | null> {
  await delay(300);
  const dataset = mockDatasets.find((d) => d.id === id);
  return dataset ?? null;
}

export async function uploadDataset(file: File): Promise<Dataset> {
  await delay(1500);

  const newDataset: Dataset = {
    id: `ds-${Date.now()}`,
    name: file.name.replace(/\.[^/.]+$/, ""),
    originalName: file.name,
    rowCount: 0,
    columnCount: 0,
    fileSize: file.size,
    status: DATASET_STATUS.PENDING,
    progress: 0,
    anomalyCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return newDataset;
}

export async function deleteDataset(id: string): Promise<void> {
  await delay(500);
  const index = mockDatasets.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error(`Dataset with id ${id} not found`);
  }
}
