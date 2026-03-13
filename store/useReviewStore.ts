import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Anomaly } from "@/types/anomaly";
import { REVIEW_ACTION } from "@/types/anomaly";

interface Progress {
  resolved: number;
  total: number;
  percentage: number;
}

interface ReviewState {
  // State
  anomalies: Anomaly[];
  currentAnomalyIndex: number;
  isSubmitting: boolean;

  // Actions
  setAnomalies: (anomalies: Anomaly[]) => void;
  approveAnomaly: (id: string) => void;
  correctAnomaly: (id: string, correction: string) => void;
  discardAnomaly: (id: string) => void;
  nextAnomaly: () => void;
  previousAnomaly: () => void;
  resetReview: () => void;

  // Computed (getters)
  getCurrentAnomaly: () => Anomaly | null;
  getProgress: () => Progress;
  getPendingAnomalies: () => Anomaly[];
}

export const useReviewStore = create<ReviewState>()(
  immer((set, get) => ({
    // Initial state
    anomalies: [],
    currentAnomalyIndex: 0,
    isSubmitting: false,

    // Actions
    setAnomalies: (anomalies) =>
      set((state) => {
        state.anomalies = anomalies;
        state.currentAnomalyIndex = 0;
      }),

    approveAnomaly: (id) =>
      set((state) => {
        const anomaly = state.anomalies.find((a: Anomaly) => a.id === id);
        if (anomaly) {
          anomaly.action = REVIEW_ACTION.APPROVED;
        }
      }),

    correctAnomaly: (id, correction) =>
      set((state) => {
        const anomaly = state.anomalies.find((a: Anomaly) => a.id === id);
        if (anomaly) {
          anomaly.action = REVIEW_ACTION.CORRECTED;
          anomaly.userCorrection = correction;
        }
      }),

    discardAnomaly: (id) =>
      set((state) => {
        const anomaly = state.anomalies.find((a: Anomaly) => a.id === id);
        if (anomaly) {
          anomaly.action = REVIEW_ACTION.DISCARDED;
        }
      }),

    nextAnomaly: () =>
      set((state) => {
        if (state.currentAnomalyIndex < state.anomalies.length - 1) {
          state.currentAnomalyIndex += 1;
        }
      }),

    previousAnomaly: () =>
      set((state) => {
        if (state.currentAnomalyIndex > 0) {
          state.currentAnomalyIndex -= 1;
        }
      }),

    resetReview: () =>
      set((state) => {
        state.anomalies = [];
        state.currentAnomalyIndex = 0;
        state.isSubmitting = false;
      }),

    // Computed (getters)
    getCurrentAnomaly: () => {
      const { anomalies, currentAnomalyIndex } = get();
      return anomalies[currentAnomalyIndex] ?? null;
    },

    getProgress: () => {
      const { anomalies } = get();
      const total = anomalies.length;
      const resolved = anomalies.filter(
        (a) => a.action !== REVIEW_ACTION.PENDING
      ).length;
      const percentage = total === 0 ? 0 : Math.round((resolved / total) * 100);
      return { resolved, total, percentage };
    },

    getPendingAnomalies: () => {
      const { anomalies } = get();
      return anomalies.filter((a) => a.action === REVIEW_ACTION.PENDING);
    },
  }))
);
