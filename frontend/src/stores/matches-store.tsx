import { IpponType, Match } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface MatchesState {
	rounds: Match[][];
	initialRounds: Match[][] | null;
}

interface MatchesActions {
	setMatches: (rounds: Match[][]) => void;
	setScore: (
		matchId: string,
		player: "player1" | "player2",
		index: number,
		value: IpponType
	  ) => void;
}

type MatchesStore = MatchesState & MatchesActions;

export const useMatchesStore = create<MatchesStore>()(
	immer((set) => ({
		rounds: [],
		initialRounds: null,

		setMatches: (rounds) => set({ rounds: rounds, initialRounds: rounds }),
		setScore: (matchId, player, index, value) =>
			set((state) => {
			  const match = state.rounds.flat().find((m) => m.id === matchId);
			  if (match) {
				if (player === "player1") {
				  match.player1Score[index] = value;
				} else {
				  match.player2Score[index] = value;
				}
			  }
			}),
	}))
);
