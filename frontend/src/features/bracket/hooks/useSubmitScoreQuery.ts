import { useChangeTrackingStore } from "@/stores/change-tracking-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { batchUpdateBracket } from "../api";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

export const useSubmitScoreQuery = () => {
  const [clearChanges] = useChangeTrackingStore(
    useShallow((state) => [state.clearChanges])
  );

  const queryClient = useQueryClient();
  const submitScoreMutation = useMutation({
    mutationFn: batchUpdateBracket,
    onSuccess: async () => {
      console.log(`Successfully submitted score`);
      await queryClient.invalidateQueries({ queryKey: ["bracket"] });
    },
  });

  const submitScore = useCallback(() => {
    const changes = useChangeTrackingStore.getState().changes;
    submitScoreMutation.mutate(changes);
    clearChanges();
  }, [submitScoreMutation]);

  return { submitScore, isSubmittingScore: submitScoreMutation.isPending };
};
