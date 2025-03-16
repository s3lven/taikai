import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createBracket,
  createTournament,
  deleteBracket,
  deleteTournament,
  // getTournaments,
  getUserTournaments,
  updateTournament,
} from "../api"
import {
  CreateBracketForm,
  CreateTournamentForm,
  Tournament,
  TournamentForm,
  TournamentStatusType,
} from "@/types"
import { useCallback } from "react"

const useTournamentData = () => {
  const queryClient = useQueryClient()

  const {
    data: tournaments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getUserTournaments,
  })

  const getFilteredTournaments = (status: TournamentStatusType) => {
    return tournaments.filter((t) => t.status === status)
  }

  const addMutation = useMutation({
    mutationFn: createTournament,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] })
    },
  })

  const addTournament = useCallback(
    async (tournament: CreateTournamentForm) => {
      addMutation.mutate(tournament, {
        onSuccess: () => {},
        onError: (error: Error) => {
          console.error(error.message)
        },
      })
    },
    [addMutation]
  )
  const editMutation = useMutation({
    mutationFn: updateTournament,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] })
    },
  })

  const editTournament = useCallback(
    async (id: number, tournament: TournamentForm) => {
      editMutation.mutate(
        { id, tournament },
        {
          onSuccess: () => {},
          onError: (error: Error) => {
            console.error(error.message)
          },
        }
      )
    },
    [editMutation]
  )
  const removeMutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] })
    },
  })

  const removeTournament = useCallback(
    async (id: number) => {
      removeMutation.mutate(id, {
        onSuccess: () => {},
        onError: (error: Error) => {
          console.error(error.message)
        },
      })
    },
    [removeMutation]
  )

  const addBracketMutation = useMutation({
    mutationFn: createBracket,
    onSuccess: (newBracket) => {
      queryClient.setQueryData<Tournament[]>(["tournaments"], (oldData) => {
        if (!oldData) return oldData

        return oldData.map((tournament) =>
          tournament.id === newBracket.tournamentID
            ? {
                ...tournament,
                brackets: [...tournament.brackets, newBracket],
              }
            : tournament
        )
      })
    },
  })

  const addBracket = useCallback(
    async (bracket: CreateBracketForm) => {
      const result = await addBracketMutation.mutateAsync(bracket, {
        onSuccess: () => {},
        onError: (error: Error) => {
          console.error(error.message)
        },
      })
      return result
    },
    [addBracketMutation]
  )

  const removeBracketMutation = useMutation({
    mutationFn: deleteBracket,
    onSuccess: (_, variables) => {
      const { tournamentID, bracketID } = variables
      // await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.setQueryData<Tournament[]>(["tournaments"], (oldData) => {
        if (!oldData) return oldData

        return oldData.map((tournament) =>
          tournament.id === tournamentID
            ? {
                ...tournament,
                brackets: tournament.brackets.filter((b) => b.id !== bracketID),
              }
            : tournament
        )
      })
    },
  })

  const removeBracket = useCallback(
    async (tournamentID: number, bracketID: number) => {
      removeBracketMutation.mutate(
        { tournamentID, bracketID },
        {
          onSuccess: () => {},
          onError: (error: Error) => {
            console.error(error.message)
          },
        }
      )
    },
    [removeBracketMutation]
  )

  return {
    tournaments,
    isLoading,
    isError,
    error,
    refetch,
    getFilteredTournaments,
    addTournament,
    isAddingTournament: addMutation.isPending,
    editTournament,
    isEditingTournament: editMutation.isPending,
    removeTournament,
    isRemovingTournament: removeMutation.isPending,
    addBracket,
    isAddingBracket: addBracketMutation.isPending,
    removeBracket,
    isRemovingBracket: removeBracketMutation.isPending,
  }
}

export default useTournamentData
