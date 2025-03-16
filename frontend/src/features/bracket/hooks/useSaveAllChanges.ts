import { useChangeTrackingStore } from "@/stores/change-tracking-store";
import { useParticipantStore } from "@/stores/participant-store";
import { useBracketStore } from "@/stores/bracket-store";
import { useShallow } from "zustand/react/shallow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { batchUpdateBracket } from "../api";
import { useCallback } from "react";

export const useSaveAllChanges = () => {
  const clearChanges = useChangeTrackingStore((state) => state.clearChanges);
  const generateParticipantChanges = useParticipantStore(
    (state) => state.generateParticipantChanges
  );
  const generateBracketChanges = useBracketStore(
    useShallow((state) => state.generateBracketChanges)
  );

  const queryClient = useQueryClient();

  const saveChangesMutation = useMutation({
    mutationFn: batchUpdateBracket,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bracket"] });
    },
  });

  const saveAllChanges = useCallback(() => {
    // Generate changes by comparing against initial state
    generateParticipantChanges();
    generateBracketChanges();

    const newChanges = useChangeTrackingStore.getState().changes;
    if (newChanges.length === 0) return;
    saveChangesMutation.mutate(newChanges);

    // Reset the initial states
    useParticipantStore.setState((state) => {
      state.initialParticipants = state.participants;
    });
    useBracketStore.setState((state) => {
      state.initialBracket = state.bracket;
    });
    clearChanges();
  }, [saveChangesMutation]);

  return { saveAllChanges, isSaving: saveChangesMutation.isPending };
};
