import { IpponType, Match, Participant } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useBracketStore } from "./bracket-store";

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
	submitScore: (matchId: string, winner: Participant | null) => void;
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
		submitScore: (matchId, winner) =>
			set((state) => {
				// Set the winner
				const match = state.rounds.flat().find((m) => m.id === matchId);
				if (match) {
					match.winner = winner;
				}

				// Update the bracket
				state.rounds.forEach((round, roundIndex) =>
					round.forEach((match, matchIndex) => {
						const nextRoundMatchIndex = Math.floor(matchIndex / 2);
						const nextMatch =
							state.rounds[roundIndex + 1]?.[nextRoundMatchIndex];
						if (match.winner !== null) {
							if (nextMatch) {
								if (matchIndex % 2 === 0) {
									nextMatch.player1 = match.winner;
								} else {
									nextMatch.player2 = match.winner;
								}
							}
						}
					})
				);
				// Calculate and Update the progress
				let totalMatches = 0
				let completedMatches = 0

				state.rounds.forEach((round) => {
					round.forEach((match) => {
						// Check if the match is not a bye round
						if (match.id !== "BYE") {
							totalMatches++
							if (match.winner) completedMatches++
						}
					})
				})

				// Don't divide by 0
				const progress = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0
				useBracketStore.getState().updateProgress(progress)
			}),
	}))
);
