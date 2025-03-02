import { Change } from "@/types/changes";
import { create } from "zustand";

interface ChangeTrackingState {
  changes: Change[];
  addChange: (change: Omit<Change, "timestamp">) => void;
  clearChanges: () => void;
  hasUnsavedChanges: boolean;
}

export const useChangeTrackingStore = create<ChangeTrackingState>(
  (set) => ({
    changes: [],
    addChange: (change) => {
      console.log("Adding change", change);
      set((state) => ({
        changes: [...state.changes, { ...change, timestamp: Date.now() }],
        hasUnsavedChanges: true,
      }));
    },
    clearChanges: () => set({ changes: [], hasUnsavedChanges: false }),
    hasUnsavedChanges: false,
    
  })
);
