import { Change } from "@/types/changes";
import { create } from "zustand";

interface ChangeTrackingState {
	changes: Change[];
	addChange: (change: Omit<Change, "timestamp">) => void;
	clearChanges: () => void;
	hasUnsavedChanges: boolean;
	getConsolidatedChanges: () => Change[];
}

export const useChangeTrackingStore = create<ChangeTrackingState>((set, get) => ({
	changes: [],
	addChange: (change) => {
        console.log('Adding change', change);
		set((state) => ({
			changes: [...state.changes, { ...change, timestamp: Date.now() }],
            hasUnsavedChanges: true,
		}));
	},
	clearChanges: () => set({ changes: [], hasUnsavedChanges: false }),
	hasUnsavedChanges: false,
	getConsolidatedChanges: () => {
		const { changes } = get();
		const consolidatedMap = new Map<string, Change>();
	
		// Process changes in chronological order
		changes.forEach((change) => {
		  const key = `${change.entityType}-${change.entityId}`;
		  const existingChange = consolidatedMap.get(key);
	
		  if (change.changeType === 'delete') {
			// If it's a DELETE, it always overrides previous changes
			consolidatedMap.set(key, change);
		  } else if (change.changeType === 'create') {
			if (!existingChange) {
			  // Only keep CREATE if there's no existing change
			  consolidatedMap.set(key, change);
			}
		  } else if (change.changeType === 'update') {
			if (existingChange?.changeType === 'update') {
			  // Merge UPDATE payloads
			  consolidatedMap.set(key, {
				...change,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				payload: { ...existingChange.payload, ...change.payload },
			  });
			} else if (!existingChange || existingChange.changeType === 'create') {
			  // Set UPDATE if no existing change or after CREATE
			  consolidatedMap.set(key, change);
			}
		  } else if (change.changeType === 'move') {
			// Only keep the latest REORDER
			consolidatedMap.set(key, change);
		  }
		});
	
		return Array.from(consolidatedMap.values());
	  },
}));
