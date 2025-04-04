import { useMutation, useQueryClient } from "@tanstack/react-query"
import { completeBracket, openBracket, resetBracket, runBracket } from "../api"
import { Change } from "@/types/changes"
import { useCallback } from "react"
import { useBracketStore } from "@/stores/bracket-store"
import { useParticipantStore } from "@/stores/participant-store"
import { useChangeTrackingStore } from "@/stores/change-tracking-store"

export function useBracketMutations() {
  const queryClient = useQueryClient()

  // Run bracket mutation
  const runBracketMutation = useMutation({
    mutationFn: ({
      bracketId,
      changes,
    }: {
      bracketId: number
      changes?: Change[]
    }) => runBracket(bracketId, changes),
    onSuccess: () => {
      // Invalidate and refetch bracket data
      queryClient.invalidateQueries({ queryKey: ["bracket"] })
    },
  })

  // Reset bracket mutation
  const resetBracketMutation = useMutation({
    mutationFn: (bracketId: number) => resetBracket(bracketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bracket"] })
    },
  })

  // Open bracket mutation
  const openBracketMutation = useMutation({
    mutationFn: (bracketId: number) => openBracket(bracketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bracket"] })
    },
  })

  // Complete bracket mutation
  const completeBracketMutation = useMutation({
    mutationFn: (bracketId: number) => completeBracket(bracketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bracket"] })
    },
  })

  const saveRunBracket = useCallback(() => {
    const bracketId = useBracketStore.getState().bracket.id

    // Generate changes to send to mutation
    useBracketStore.getState().generateBracketChanges()
    useParticipantStore.getState().generateParticipantChanges()
    const changes = useChangeTrackingStore.getState().changes

    // If there are no changes, then return early
    if (changes.length === 0) return

    // Run the mutation
    runBracketMutation.mutate({ bracketId, changes })

    // Reset the initial states
    useParticipantStore.setState((state) => {
      state.initialParticipants = state.participants
    })
    useBracketStore.setState((state) => {
      state.initialBracket = state.bracket
    })
    useChangeTrackingStore.getState().clearChanges()
  }, [runBracketMutation])

  return {
    saveRunBracket,
    isSavingRunBracket: runBracketMutation.isPending,
    resetBracketMutation,
    openBracketMutation,
    completeBracketMutation,
  }
}
