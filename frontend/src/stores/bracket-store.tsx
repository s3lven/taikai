import { Bracket, BracketEditor, BracketStatusType, Tournament } from "@/types";
import { create } from "zustand";
import { useChangeTrackingStore } from "./change-tracking-store";
import { immer } from "zustand/middleware/immer";
import { useMatchesStore } from "./matches-store";
import { useParticipantStore } from "./participant-store";

interface BracketState {
  bracket: BracketEditor;
}

interface BracketActions {
  setBracket: (
    bracket: Bracket,
    tournament: Omit<Tournament, "brackets">
  ) => void;
  runBracket: () => void;
  resetBracket: () => void;
  completeBracket: () => void;
  reopenBracket: () => void;
  updateProgress: (progress: number) => void;
  setBracketName: (name: string) => void;
  setBracketType: (type: string) => void;
}

type BracketStore = BracketState & BracketActions;

export const useBracketStore = create<BracketStore>()(
  immer((set) => ({
    bracket: {
      id: 0,
      name: "",
      status: "Editing",
      type: "Single Elimination",
      tournamentName: "",

      // Client only
      participantCount: 0,
      progress: 0,
    },

    setBracket: (bracket: Bracket, tournament: Omit<Tournament, "brackets">) =>
      set((state) => {
        state.bracket = {
          ...state.bracket,
          ...bracket,
          tournamentName: tournament.name,
        };
      }),
    runBracket: () => {
      set((state) => {
        const participants = useParticipantStore.getState().participants;

        // Check if any participant name is empty
        const hasEmptyName = participants.some(
          (participant) => !participant.name
        );
        if (hasEmptyName) {
          // TODO: Send a toast instead of an alert
          alert("Fill out all of the required participant names");
          return state; // Early return, no state update
        }
        state.bracket = {
          ...state.bracket,
          status: "In Progress" as BracketStatusType,
          progress: 0,
        };
      });
    },
    resetBracket: () =>
      set((state) => {
        state.bracket = {
          ...state.bracket,
          status: "Editing",
          progress: 0,
        };
        useMatchesStore.getState().resetBracket();
      }),
    completeBracket: () =>
      set((state) => {
        state.bracket = {
          ...state.bracket,
          status: "Completed",
        };
      }),
    reopenBracket: () =>
      set((state) => {
        state.bracket = {
          ...state.bracket,
          status: "In Progress",
        };
      }),
    updateProgress: (progress: number) =>
      set((state) => {
        state.bracket.progress = progress;
      }),
    setBracketName: (name: string) =>
      set((state) => {
        const newState = { bracket: { ...state.bracket, name } };
        useChangeTrackingStore.getState().addChange({
          entityType: "bracket",
          changeType: "update",
          entityId: state.bracket.id,
          payload: { name },
        });
        return newState;
      }),
    setBracketType: (type: string) =>
      set((state) => {
        const newState = { bracket: { ...state.bracket, type } };
        useChangeTrackingStore.getState().addChange({
          entityType: "bracket",
          changeType: "update",
          entityId: state.bracket.id,
          payload: { type },
        });
        return newState;
      }),
  }))
);
