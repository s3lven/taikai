import { useChangeTrackingStore } from "@/stores/change-tracking-store";
import { useParticipantStore } from "@/stores/participant-store";
import { batchUpdateBracket } from "../api";
import { useBracketStore } from "@/stores/bracket-store";
import { useShallow } from "zustand/react/shallow";

export const useSaveAllChanges = () => {
  const clearChanges = useChangeTrackingStore((state) => state.clearChanges);
  const generateParticipantChanges = useParticipantStore(
    (state) => state.generateParticipantChanges
  );
  const generateBracketChanges = useBracketStore(
    useShallow((state) => state.generateBracketChanges)
  );

  const saveAllChanges = async () => {
    try {
      clearChanges();

      // Generate changes by comparing against initial state
      generateParticipantChanges();
      generateBracketChanges();

      const newChanges = useChangeTrackingStore.getState().changes;

      console.log("Received changes: ", newChanges);
      await batchUpdateBracket(newChanges);

      console.log("Resetting Data")
      useParticipantStore.setState((state) => {
        state.initialParticipants = state.participants;
      });
      useBracketStore.setState((state) => {
        state.initialBracket = state.bracket;
      });
      clearChanges();
    } catch (error) {
      console.error("Failed to save changes", error);
    }
  };

  return saveAllChanges;
};
