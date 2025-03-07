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
  }))
);
