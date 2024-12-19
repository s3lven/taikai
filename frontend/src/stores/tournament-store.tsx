import { Tournament, CreateTournament } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TournamentState {
	tournaments: Tournament[];
	editingTournament: Tournament | null;
	viewingTournament: Tournament | null;
	isAddingTournament: boolean;
	isLoading: boolean;
	error: string | null;
}

interface TournamentActions {
	addTournament: (tournament: CreateTournament) => Promise<void>;
	removeTournament: (id: number) => Promise<void>;
	updateTournament: (
		id: number,
		updatedTournament: Tournament
	) => Promise<void>;

	setInitialTournaments: (tournaments: Tournament[]) => void;
	fetchTournaments: () => Promise<void>;

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
			set({ isLoading: true, error: null });
			try {
				const response = await fetch("http://localhost:3000/api/tournaments");
				if (!response.ok) {
					throw new Error("Failed to fetch tournaments");
				}
				const data: Tournament[] =
					(await response.json()) as unknown as Tournament[];
				set({ tournaments: data, isLoading: false });
			} catch (error) {
				if (error instanceof Error) {
					set({ error: error.message, isLoading: false });
				} else {
					set({
						error: "An error occurred while fetching tournaments",
						isLoading: false,
					});
				}
			}
		},
		setInitialTournaments: (tournaments) =>
			set(() => ({
				tournaments: tournaments,
			})),
		addTournament: async (tournament) => {
			try {
				const response = await fetch("http://localhost:3000/api/tournaments", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(tournament),
				});
				if (!response.ok) {
					throw new Error("Failed to create a new tournament");
				}
				const data: CreateTournament =
					(await response.json()) as unknown as CreateTournament;
				set((state) => ({
					tournaments: [...state.tournaments, data],
				}));
			} catch (error) {
				if (error instanceof Error) {
					set({ error: error.message, isLoading: false });
				} else {
					set({
						error: "An error occurred while fetching tournaments",
						isLoading: false,
					});
				}
			}
		},
		removeTournament: async (id) => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/tournaments/${id}`,
					{
						method: "DELETE",
					}
				);
				if (!response.ok) {
					throw new Error("Failed to delete the tournament");
				}
				set((state) => ({
					tournaments: state.tournaments.filter(
						(tournament) => tournament.id !== id
					),
				}));
			} catch (error) {
				if (error instanceof Error) {
					set({ error: error.message, isLoading: false });
				} else {
					set({
						error: "An error occurred while fetching tournaments",
						isLoading: false,
					});
				}
			}
		},
		updateTournament: async (id, updatedTournament) => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/tournaments/${id}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(updatedTournament),
					}
				);
				if (!response.ok) {
					throw new Error("Failed to update the tournament");
				}
				const data: {message: string, result: Tournament[]} =
					(await response.json()) as unknown as {message: string, result: Tournament[]};
				set((state) => ({
					tournaments: state.tournaments.map((tournament) =>
						tournament.id === id
							? { ...tournament, ...data.result[0] }
							: tournament
					),
				}));
			} catch (error) {
				if (error instanceof Error) {
					set({ error: error.message, isLoading: false });
				} else {
					set({
						error: "An error occurred while updating a tournament",
						isLoading: false,
					});
				}
			}
		},
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
