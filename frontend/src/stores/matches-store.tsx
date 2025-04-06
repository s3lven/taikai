import { IpponType, Match, Participant, PlayerColorType } from "@/types"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { useBracketStore } from "./bracket-store"
import { useChangeTrackingStore } from "./change-tracking-store"

interface MatchesState {
	rounds: Match[][]
	initialRounds: Match[][] | null
}

interface MatchesActions {
	setMatches: (rounds: Match[][]) => void
	setScore: (matchId: number, color: PlayerColorType, value: IpponType) => void
	clearScore: (matchId: number) => void
	submitScore: (matchId: number) => Participant | null
	resetBracket: () => void
	isBracketCompleted: () => boolean
	resetMatch: (matchId: number) => void
}

type MatchesStore = MatchesState & MatchesActions

export const useMatchesStore = create<MatchesStore>()(
	immer((set, get) => ({
		rounds: [],
		initialRounds: null,

		setMatches: (rounds) => set({ rounds: rounds, initialRounds: rounds }),
		setScore: (matchId, color, value) =>
			set((state) => {
				// Find the match
				const match = state.rounds.flat().find((m) => m.id === matchId)
				if (!match) return state // Return current state if no match found

				// If the scoreboard has Hantei, there shouldn't be any other points
				if (
					match.player1Score.includes("Hantei") ||
					match.player2Score.includes("Hantei")
				)
					return state

				if (value === "Hansoku") {
					if (color === "Red") {
						if (match.hasPlayer1Hansoku) {
							// If there are three points on the board, then dont do anything
							if (
								match.player1Score.length + match.player2Score.length === 3 ||
								match.player2Score.length >= 2
							)
								return state

							match.player2Score.push("Hansoku")
							match.hasPlayer1Hansoku = false
						} else {
							match.hasPlayer1Hansoku = true
						}
					} else {
						if (match.hasPlayer2Hansoku) {
							// If there are three points on the board, then dont do anything
							if (
								match.player1Score.length + match.player2Score.length === 3 ||
								match.player1Score.length >= 2
							)
								return state

							match.player1Score.push("Hansoku")
							match.hasPlayer2Hansoku = false
						} else {
							match.hasPlayer2Hansoku = true
						}
					}
					return state
				}

				// Regular score handling
				if (match.player1Score.length + match.player2Score.length === 3)
					return state

				if (!match.firstScorer) {
					match.firstScorer = color === "Red" ? match.player1 : match.player2
				}

				if (color === "Red" && match.player1Score.length < 2) {
					match.player1Score.push(value)
				} else if (color === "White" && match.player2Score.length < 2) {
					match.player2Score.push(value)
				}

				return state
			}),
		clearScore: (matchId) => {
			set((state) => {
				// Find match
				const match = state.rounds.flat().find((m) => m.id === matchId)
				if (!match) return state

				match.player1Score = []
				match.player2Score = []
				match.firstScorer = null
				match.winner = null
				match.hasPlayer1Hansoku = false
				match.hasPlayer2Hansoku = false
			})
		},
		submitScore: (matchId) => {
			const bracketId = useBracketStore.getState().bracket.id
			let winner: Participant | null = null

			const match = get()
				.rounds.flat()
				.find((m) => m.id === matchId)
			if (!match) {
				throw new Error("Match not found")
			}

			// Determine the winner
			if (match.player1Score.length > match.player2Score.length) {
				winner = match.player1
			} else if (match.player2Score.length > match.player1Score.length) {
				winner = match.player2
			}

			if (!winner) return null

			set((state) => {
				const mat = state.rounds.flat().find((m) => m.id === matchId)
				if (!mat) {
					throw new Error("There is no match")
				}

				mat.winner = winner

				// Get match index and round index of next round to set the winner to new players
				const roundIndex = state.rounds.findIndex((round) =>
					round.find((match) => match.id === matchId)
				)
				const matchIndex = state.rounds[roundIndex].findIndex(
					(match) => match.id === matchId
				)
				const nextRoundMatchIndex = Math.floor(matchIndex / 2)
				const nextMatch = state.rounds[roundIndex + 1]?.[nextRoundMatchIndex]
				if (nextMatch) {
					if (matchIndex % 2 === 0) {
						nextMatch.player1 = winner
						useChangeTrackingStore.getState().addChange({
							entityType: "match",
							changeType: "update",
							entityId: bracketId,
							payload: { id: nextMatch.id, player1_id: winner?.id },
						})
					} else {
						nextMatch.player2 = winner
						useChangeTrackingStore.getState().addChange({
							entityType: "match",
							changeType: "update",
							entityId: bracketId,
							payload: { id: nextMatch.id, player2_id: winner?.id },
						})
					}
				}
			})

			// Calculate and Update the progress
			useBracketStore.getState().updateProgress()
			console.log("Updating the progress")

			// Reflect change in the change tracking store
			useChangeTrackingStore.getState().addChange({
				entityType: "match",
				changeType: "update",
				entityId: bracketId,
				payload: {
					id: matchId,
					winner_id: winner.id,
					player1_score: match.player1Score,
					player2_score: match.player2Score,
					has_player1_hansoku: match.hasPlayer1Hansoku,
					has_player2_hansoku: match.hasPlayer2Hansoku,
					first_scorer: match.firstScorer
				},
			})

			return winner
		},
		// Used in bracket store to reset all matches
		resetBracket: () => {
			set((state) => {
				if (state.initialRounds) state.rounds = state.initialRounds
				else throw new Error("There is no initial bracket!")
			})
		},
		isBracketCompleted: () =>
			get()
				.rounds.flat()
				.flat()
				.filter((match) => match.id !== -1)
				.every((match) => match.winner !== null),
		resetMatch: (matchId) => {
			const bracketId = useBracketStore.getState().bracket.id

			// Find the round index and match index
			const roundIndex = get().rounds.findIndex((round) =>
				round.find((match) => match.id === matchId)
			)
			const matchIndex = get().rounds[roundIndex].findIndex(
				(match) => match.id === matchId
			)

			// If there's no round or match index, return
			if (roundIndex === -1 || matchIndex === -1) return

			set((state) => {
				const resetDependentMatches = (
					currentRoundIndex: number,
					currentMatchIndex: number
				) => {
					if (currentRoundIndex >= state.rounds.length - 1) return // Stop at the last round

					// Stop if there isnt any players
					if (
						!state.rounds[currentRoundIndex][currentMatchIndex].player1 &&
						!state.rounds[currentRoundIndex][currentMatchIndex].player2
					)
						return

					const nextRound = state.rounds[currentRoundIndex + 1]
					const dependentMatchIndex = Math.floor(currentMatchIndex / 2)
					const dependentMatch = nextRound[dependentMatchIndex]

					if (!dependentMatch) return

					// Reset the dependent match
					dependentMatch.player1Score = []
					dependentMatch.player2Score = []
					dependentMatch.winner = null
					dependentMatch.hasPlayer1Hansoku = false
					dependentMatch.hasPlayer2Hansoku = false
					dependentMatch.firstScorer = null

					if (currentMatchIndex % 2 === 0) {
						dependentMatch.player1 = null
						useChangeTrackingStore.getState().addChange({
							entityType: "match",
							changeType: "update",
							entityId: bracketId,
							payload: {
								id: dependentMatch.id,
								player1_id: null,
								player1_score: [],
								player2_score: [],
								winner_id: null,
								has_player1_hansoku: false,
								has_player2_hansoku: false,
								first_scorer: null
							},
						})
					} else {
						dependentMatch.player2 = null
						useChangeTrackingStore.getState().addChange({
							entityType: "match",
							changeType: "update",
							entityId: bracketId,
							payload: {
								id: dependentMatch.id,
								player2_id: null,
								player1_score: [],
								player2_score: [],
								winner_id: null,
								has_player1_hansoku: false,
								has_player2_hansoku: false,
								first_scorer: null
							},
						})
					}

					// Recur to reset matches in the next round
					resetDependentMatches(currentRoundIndex + 1, dependentMatchIndex)
				}

				// Reset the initial match
				const match = state.rounds[roundIndex][matchIndex]
				match.player1Score = []
				match.player2Score = []
				match.winner = null
				match.hasPlayer1Hansoku = false
				match.hasPlayer2Hansoku = false
				match.firstScorer = null

				// Change tracking of initial match
				useChangeTrackingStore.getState().addChange({
					entityType: "match",
					changeType: "update",
					entityId: bracketId,
					payload: {
						id: matchId,
						player1_score: [],
						player2_score: [],
						winner_id: null,
						has_player1_hansoku: false,
						has_player2_hansoku: false,
						first_scorer: null
					},
				})

				// Reset all dependent matches recursively
				resetDependentMatches(roundIndex, matchIndex)
			})

			useBracketStore.getState().updateProgress()
		},
	}))
)
