import { IpponType, Match, Participant } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useBracketStore } from "./bracket-store";
import { useChangeTrackingStore } from "./change-tracking-store";

interface MatchesState {
  rounds: Match[][];
  initialRounds: Match[][] | null;
}

interface MatchesActions {
  setMatches: (rounds: Match[][]) => void;
  setScore: (
    matchId: number,
    player: "player1" | "player2",
    index: number,
    value: IpponType
  ) => void;
  submitScore: (matchId: number, winner: Participant | null) => void;
  resetBracket: () => void;
  isBracketCompleted: () => boolean;
  resetMatch: (matchId: number) => void;
}

type MatchesStore = MatchesState & MatchesActions;

export const useMatchesStore = create<MatchesStore>()(
  immer((set, get) => ({
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
    submitScore: (matchId, winner) => {
      const bracketId = useBracketStore.getState().bracket.id;
      set((state) => {
        const match = state.rounds.flat().find((m) => m.id === matchId);

        if (!match) {
          throw new Error("Match not found");
        }

        match.winner = winner;

        // Get match index and round index of next round to set the winner to new players
        const roundIndex = state.rounds.findIndex((round) =>
          round.find((match) => match.id === matchId)
        );
        const matchIndex = state.rounds[roundIndex].findIndex(
          (match) => match.id === matchId
        );
        const nextRoundMatchIndex = Math.floor(matchIndex / 2);
        const nextMatch = state.rounds[roundIndex + 1]?.[nextRoundMatchIndex];
        if (match.winner !== null) {
          if (nextMatch) {
            if (matchIndex % 2 === 0) {
              nextMatch.player1 = winner;
              useChangeTrackingStore.getState().addChange({
                entityType: "match",
                changeType: "update",
                entityId: bracketId,
                payload: { id: nextMatch.id, player1_id: winner?.id },
              });
            } else {
              nextMatch.player2 = winner;
              useChangeTrackingStore.getState().addChange({
                entityType: "match",
                changeType: "update",
                entityId: bracketId,
                payload: { id: nextMatch.id, player2_id: winner?.id },
              });
            }
          }
        }

        // Calculate and Update the progress
        let totalMatches = 0;
        let completedMatches = 0;

        state.rounds.forEach((round) => {
          round.forEach((match) => {
            // Check if the match is not a bye round
            if (match.id !== -1) {
              totalMatches++;
              if (match.winner) completedMatches++;
            }
          });
        });

        // Don't divide by 0
        const progress =
          totalMatches > 0
            ? Math.round((completedMatches / totalMatches) * 100)
            : 0;
        useBracketStore.getState().updateProgress(progress);
      });

      // Reflect changes in the change tracking store
      const mat = get()
        .rounds.flat()
        .find((m) => m.id === matchId);

      if (!mat) {
        throw new Error("Match not found");
      }

      // Reflect change in the change tracking store
      useChangeTrackingStore.getState().addChange({
        entityType: "match",
        changeType: "update",
        entityId: bracketId,
        payload: {
          id: matchId,
          winner_id: winner?.id,
          player1_score: mat.player1Score,
          player2_score: mat.player2Score,
        },
      });
    },
    // Used in bracket store to reset all matches
    resetBracket: () => {
      set((state) => {
        if (state.initialRounds) state.rounds = state.initialRounds;
        else throw new Error("There is no initial bracket!");
      });
    },
    isBracketCompleted: () =>
      get()
        .rounds.flat()
        .flat()
        .filter((match) => match.id !== -1)
        .every((match) => match.winner !== null),
    resetMatch: (matchId) => {
      const bracketId = useBracketStore.getState().bracket.id;

      // Find the round index and match index
      const roundIndex = get().rounds.findIndex((round) =>
        round.find((match) => match.id === matchId)
      );
      const matchIndex = get().rounds[roundIndex].findIndex(
        (match) => match.id === matchId
      );

      // If there's no round or match index, return
      if (roundIndex === -1 || matchIndex === -1) return;

      set((state) => {
        const resetDependentMatches = (
          currentRoundIndex: number,
          currentMatchIndex: number
        ) => {
          if (currentRoundIndex >= state.rounds.length - 1) return; // Stop at the last round

          // Stop if there isnt any players
          if (
            !state.rounds[currentRoundIndex][currentMatchIndex].player1 &&
            !state.rounds[currentRoundIndex][currentMatchIndex].player2
          )
            return;

          const nextRound = state.rounds[currentRoundIndex + 1];
          const dependentMatchIndex = Math.floor(currentMatchIndex / 2);
          const dependentMatch = nextRound[dependentMatchIndex];

          if (!dependentMatch) return;

          // Reset the dependent match
          dependentMatch.player1Score = [];
          dependentMatch.player2Score = [];
          dependentMatch.winner = null;

          if (currentMatchIndex % 2 === 0) {
            dependentMatch.player1 = null;
            useChangeTrackingStore.getState().addChange({
              entityType: "match",
              changeType: "update",
              entityId: bracketId,
              payload: {
                id: dependentMatch.id,
                player1_id: null,
                player1_score: [],
                player2_score: [],
                winner: null,
              },
            });
          } else {
            dependentMatch.player2 = null;
            useChangeTrackingStore.getState().addChange({
              entityType: "match",
              changeType: "update",
              entityId: bracketId,
              payload: {
                id: dependentMatch.id,
                player2_id: null,
                player1_score: [],
                player2_score: [],
                winner: null,
              },
            });
          }

          // Recur to reset matches in the next round
          resetDependentMatches(currentRoundIndex + 1, dependentMatchIndex);
        };

        // Reset the initial match
        const match = state.rounds[roundIndex][matchIndex];
        match.player1Score = [];
        match.player2Score = [];
        match.winner = null;

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
          },
        });

        // Reset all dependent matches recursively
        resetDependentMatches(roundIndex, matchIndex);
      });
    },
  }))
);
