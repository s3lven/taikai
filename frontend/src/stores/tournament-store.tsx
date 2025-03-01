import { Tournament } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TournamentState {
  tournaments: Tournament[];
  editingTournament: Tournament | null;
  viewingTournament: Tournament | null;
  isAddingDialogOpen: boolean;
}

interface TournamentActions {
  // For viewing tournament-related details on modals/dialogs
  setEditingTournament: (tournament: Tournament | null) => void;
  setViewingTournament: (tournament: Tournament | null) => void;
  setIsAddingDialogOpen: (isAdding: boolean) => void;

  removeBracket: (bracketId: number) => Promise<void>;
  addBracket: (tournamentId: number) => Promise<number | undefined>;
}

export type TournamentStore = TournamentState & TournamentActions;

export const useTournamentStore = create<TournamentStore>()(
  immer((set) => ({
    tournaments: [],
    editingTournament: null,
    viewingTournament: null,
    isAddingDialogOpen: false,

    setEditingTournament: (tournament) =>
      set({ editingTournament: tournament }),
    setViewingTournament: (tournament) =>
      set({ viewingTournament: tournament }),
    setIsAddingDialogOpen: (isAdding) => set({ isAddingDialogOpen: isAdding }),

    removeBracket: async (bracketId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/brackets/${bracketId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete the bracket");
        }
        const data: { message: string } =
          (await response.json()) as unknown as { message: string };
        console.log(data.message);
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message, isLoading: false });
        } else {
          set({
            error: "An error occurred while removing a bracket",
            isLoading: false,
          });
        }
      }
    },
    addBracket: async (tournamentId) => {
      try {
        const response = await fetch("http://localhost:3001/api/brackets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "New Bracket",
            tournamentId: tournamentId,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add a new bracket");
        }
        const data: { id: number } = (await response.json()) as unknown as {
          id: number;
        };
        if (data.id === undefined) {
          throw new Error("Failed to retrieve the new bracket ID");
        } else {
          return data.id;
        }
      } catch (error) {
        if (error instanceof Error) {
          set({ error: error.message, isLoading: false });
        } else {
          set({
            error: "An error occurred while adding a bracket",
            isLoading: false,
          });
        }
      }
    },
  }))
);
