import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBracket,
  createTournament,
  deleteBracket,
  deleteTournament,
  getTournaments,
  updateTournament,
} from "../api";
import {
  CreateBracketForm,
  CreateTournamentForm,
  Tournament,
  TournamentForm,
  TournamentStatusType,
} from "@/types";
import { useCallback } from "react";

const useTournamentData = () => {
  const queryClient = useQueryClient();

  const {
    data: tournaments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
  });

  const getFilteredTournaments = (status: TournamentStatusType) => {
    return tournaments.filter((t) => t.status === status);
  };

  const addMutation = useMutation({
    mutationFn: createTournament,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });

  const addTournament = useCallback(
    async (tournament: CreateTournamentForm) => {
      console.log(`Adding Tournament ${tournament.name}`);
      addMutation.mutate(tournament, {
        onSuccess: () => {
          console.log(`Successfully added ${tournament.name}`);
        },
        onError: (error: Error) => {
          console.error(error.message);
        },
      });
    },
    [addMutation]
  );
  const editMutation = useMutation({
    mutationFn: updateTournament,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });

  const editTournament = useCallback(
    async (id: number, tournament: TournamentForm) => {
      console.log(`Editing Tournament ${tournament.name}`);
      editMutation.mutate(
        { id, tournament },
        {
          onSuccess: () => {
            console.log(`Successfully editted ${tournament.name}`);
          },
          onError: (error: Error) => {
            console.error(error.message);
          },
        }
      );
    },
    [editMutation]
  );
  const removeMutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });

  const removeTournament = useCallback(
    async (id: number) => {
      console.log(`Removing Tournament ID ${id}`);
      removeMutation.mutate(id, {
        onSuccess: () => {
          console.log(`Successfully removed Tournament ID ${id}`);
        },
        onError: (error: Error) => {
          console.error(error.message);
        },
      });
    },
    [removeMutation]
  );

  const addBracketMutation = useMutation({
    mutationFn: createBracket,
    onSuccess: (newBracket) => {
      queryClient.setQueryData<Tournament[]>(["tournaments"], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((tournament) =>
          tournament.id === newBracket.tournamentID
            ? {
                ...tournament,
                brackets: [...tournament.brackets, newBracket],
              }
            : tournament
        );
      });
    },
  });

  const addBracket = useCallback(
    async (bracket: CreateBracketForm) => {
      console.log(`Adding Bracket ${bracket.name}`);
      const result = await addBracketMutation.mutateAsync(bracket, {
        onSuccess: (bracket) => {
          console.log(`Successfully added ${bracket.name}`);
        },
        onError: (error: Error) => {
          console.error(error.message);
        },
      });
      return result;
    },
    [addBracketMutation]
  );

  const removeBracketMutation = useMutation({
    mutationFn: deleteBracket,
    onSuccess: (_, variables) => {
      const { tournamentID, bracketID } = variables;
      // await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.setQueryData<Tournament[]>(["tournaments"], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((tournament) =>
          tournament.id === tournamentID
            ? {
                ...tournament,
                brackets: tournament.brackets.filter((b) => b.id !== bracketID),
              }
            : tournament
        );
      });
    },
  });

  const removeBracket = useCallback(
    async (tournamentID: number, bracketID: number) => {
      console.log(`Removing Bracket ID ${bracketID}`);
      removeBracketMutation.mutate(
        { tournamentID, bracketID },
        {
          onSuccess: () => {
            console.log(`Successfully removed Bracket ID ${bracketID}`);
          },
          onError: (error: Error) => {
            console.error(error.message);
          },
        }
      );
    },
    [removeBracketMutation]
  );

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
  };
};

export default useTournamentData;
