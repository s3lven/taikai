import { Match } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface MatchesState {
	rounds: Match[][];
	initialRounds: Match[][] | null;
}

interface MatchesActions {
	setMatches: (rounds: Match[][]) => void;
}

type MatchesStore = MatchesState & MatchesActions;

export const useMatchesStore = create<MatchesStore>()(
	immer((set) => ({
		rounds: [],
		initialRounds: null,

		setMatches: (rounds) => set({ rounds: rounds, initialRounds: rounds }),
	}))
);
