import { Tournament } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TournamentState {
	tournaments: Tournament[];
	editingTournament: Tournament | null;
	viewingTournament: Tournament | null;
	isAddingTournament: boolean;
	isLoading: boolean
	error: string | null
}

interface TournamentActions {
	addTournament: (tournament: Tournament) => void;
	removeTournament: (id: number) => void;
	updateTournament: (id: number, updatedTournament: Tournament) => void;

	setInitialTournaments: (tournaments: Tournament[]) => void;
	fetchTournaments: () => Promise<void>

	// For viewing tournament-related details on modals/dialogs
	setEditingTournament: (tournament: Tournament | null) => void;
	setViewingTournament: (tournament: Tournament | null) => void;
	setIsAddingTournament: (isAdding: boolean) => void;

	removeBracket: (bracketId: number, tournamentId: number) => void;
}

export type TournamentStore = TournamentState & TournamentActions;

export const useTournamentStore = create<TournamentStore>()(
	immer((set) => ({
		tournaments: [],
		editingTournament: null,
		viewingTournament: null,
		isAddingTournament: false,
		isLoading: false,
		error: null,

		fetchTournaments: async () => {
			set({isLoading: true, error: null})
			try {
				const response = await fetch('http://localhost:3000/api/tournaments')
				if (!response.ok) {
					throw new Error('Failed to fetch tournaments')
				}
				const data: Tournament[] = (await response.json()) as unknown as Tournament[]
				set({tournaments: data, isLoading: false})
			} catch (error) {
				 if (error instanceof Error) {
					set({error: error.message, isLoading: false})
				 } else {
					set({error: 'An error occurred while fetching tournaments', isLoading: false})
				 }
			}
		},
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
		setIsAddingTournament: (isAdding) => set({ isAddingTournament: isAdding }),

		removeBracket: (bracketId, tournamentId) =>
			set((state) => ({
				tournaments: state.tournaments.map((t) =>
					t.id === tournamentId
						? {
								...t,
								brackets: t.brackets.filter((b) => b.id !== bracketId),
						  }
						: t
				),
			})),
	}))
);
