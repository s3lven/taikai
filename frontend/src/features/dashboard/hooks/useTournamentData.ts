import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTournament,
  deleteTournament,
  getTournaments,
  updateTournament,
} from "../api";
import { Tournament, TournamentForm, TournamentStatusType } from "@/types";
import { useCallback } from "react";

const useTournamentData = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
  });

  const getFilteredTournaments = (status: TournamentStatusType) => {
    const tournaments: Tournament[] =
      queryClient.getQueryData(["tournaments"]) ?? [];
    return tournaments.filter((t) => t.status === status);
  };

  const addMutation = useMutation({
    mutationFn: createTournament,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });

  const addTournament = useCallback(
    async (tournament: TournamentForm) => {
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

  return {
    tournaments: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    getFilteredTournaments,
    addTournament,
    isAddingTournament: addMutation.isPending,
    editTournament,
    isEditingTournament: editMutation.isPending,
    removeTournament,
    isRemovingTournament: removeMutation.isPending,
  };
};

export default useTournamentData;
