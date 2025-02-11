import { useChangeTrackingStore } from "@/stores/change-tracking-store";
import { useParticipantStore } from "@/stores/participant-store";
import saveChanges from "@/features/bracket/utils/saveChanges";

export const useSaveAllChanges = () => {
  const getConsolidatedChanges = useChangeTrackingStore(
    (state) => state.getConsolidatedChanges
  );
  const clearChanges = useChangeTrackingStore((state) => state.clearChanges);
  const generateParticipantChanges = useParticipantStore(
    (state) => state.generateParticipantChanges
  );

  const saveAllChanges = async () => {
    try {
      // Generate changes by comparing against initial state
      generateParticipantChanges();

      // Get consolidated changes before saving
      const consolidatedChanges = getConsolidatedChanges();
      await saveChanges(consolidatedChanges);

      useParticipantStore.setState((state) => {
        state.initialParticipants = state.participants;
      });
      clearChanges();
    } catch (error) {
      console.error("Failed to save changes", error);
    }
  };

  return saveAllChanges;
};
