import { z } from "zod";
import { DATASET_STATUS, REVIEW_ACTION } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".csv", ".xlsx", ".xls"];

export const uploadFileSchema = z
  .custom<File>((val) => val instanceof File, { error: "Must be a file" })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File size must be less than 10MB`,
  })
  .refine(
    (file) => {
      const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      return ALLOWED_EXTENSIONS.includes(extension);
    },
    {
      message: `File must be one of: ${ALLOWED_EXTENSIONS.join(", ")}`,
    }
  );

export const datasetFilterSchema = z.object({
  search: z.string().optional(),
  status: z
    .enum([
      DATASET_STATUS.PENDING,
      DATASET_STATUS.PROCESSING,
      DATASET_STATUS.AWAITING_REVIEW,
      DATASET_STATUS.COMPLETED,
      DATASET_STATUS.FAILED,
    ])
    .optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt", "rowCount"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type DatasetFilter = z.infer<typeof datasetFilterSchema>;

export const reviewDecisionSchema = z.object({
  anomalyId: z.string().min(1, { error: "Anomaly ID is required" }),
  action: z.enum([
    REVIEW_ACTION.APPROVED,
    REVIEW_ACTION.CORRECTED,
    REVIEW_ACTION.DISCARDED,
  ]),
  correction: z.string().optional(),
});

export type ReviewDecision = z.infer<typeof reviewDecisionSchema>;

export const batchDecisionSchema = z
  .array(reviewDecisionSchema)
  .min(1, { error: "At least one decision is required" });

export type BatchDecision = z.infer<typeof batchDecisionSchema>;
