import { Tournament } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface TournamentState {
	tournaments: Tournament[];
}

interface TournamentActions {
	addTournament: (tournament: Tournament) => void;
	removeTournament: (id: number) => void;
	updateTournament: (id: number, updatedTournament: Tournament) => void;

	setInitialTournaments: (tournaments: Tournament[]) => void;
}

export type TournamentStore = TournamentState & TournamentActions;

export const useTournamentStore = create<TournamentStore>()(
	immer((set) => ({
		tournaments: [],
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
	}))
);
