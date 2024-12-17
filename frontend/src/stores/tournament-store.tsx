import { Tournament } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TournamentState {
	tournaments: Tournament[];
	editingTournament: Tournament | null;
	viewingTournament: Tournament | null;
	isAddingTournament: boolean
}

interface TournamentActions {
	addTournament: (tournament: Tournament) => void;
	removeTournament: (id: number) => void;
	updateTournament: (id: number, updatedTournament: Tournament) => void;

	setInitialTournaments: (tournaments: Tournament[]) => void;

	// For viewing tournament-related details on modals/dialogs
	setEditingTournament: (tournament: Tournament | null) => void;
	setViewingTournament: (tournament: Tournament | null) => void;
	setIsAddingTournament: (isAdding: boolean) => void
}

export type TournamentStore = TournamentState & TournamentActions;

export const useTournamentStore = create<TournamentStore>()(
	immer((set) => ({
		tournaments: [],
		editingTournament: null,
		viewingTournament: null,
		isAddingTournament: false,

		setInitialTournaments: (tournaments) =>
			set(() => ({
				tournaments: tournaments,
			})),
		addTournament: (tournament) =>
			set((state) => ({
				tournaments: [...state.tournaments, tournament],
			})),
		removeTournament: (id) =>
			set((state) => ({
				tournaments: state.tournaments.filter(
					(tournament) => tournament.id !== id
				),
			})),
		updateTournament: (id, updatedTournament) =>
			set((state) => ({
				tournaments: state.tournaments.map((tournament) =>
					tournament.id === id
						? { ...tournament, ...updatedTournament }
						: tournament
				),
			})),
		setEditingTournament: (tournament) =>
			set({ editingTournament: tournament }),
		setViewingTournament: (tournament) =>
			set({ viewingTournament: tournament }),
		setIsAddingTournament: (isAdding) => 
			set({ isAddingTournament: isAdding}),
	}))
);
