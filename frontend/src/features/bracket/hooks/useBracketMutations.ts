import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeBracket, openBracket, resetBracket, runBracket } from "../api";

export function useBracketMutations() {
  const queryClient = useQueryClient();

  // Run bracket mutation
  const runBracketMutation = useMutation({
    mutationFn: (bracketId: number) => runBracket(bracketId),
    onSuccess: () => {
      // Invalidate and refetch bracket data
      queryClient.invalidateQueries({ queryKey: ["bracket"] });
    },
  });

  // Reset bracket mutation
  const resetBracketMutation = useMutation({
    mutationFn: (bracketId: number) => resetBracket(bracketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bracket"] });
    },
  });

  // Open bracket mutation
  const openBracketMutation = useMutation({
    mutationFn: (bracketId: number) => openBracket(bracketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bracket"] });
    },
  });

  // Complete bracket mutation
  const completeBracketMutation = useMutation({
    mutationFn: (bracketId: number) => completeBracket(bracketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bracket"] });
    },
  });

  return {
    runBracketMutation,
    resetBracketMutation,
    openBracketMutation,
    completeBracketMutation,
  };
}
