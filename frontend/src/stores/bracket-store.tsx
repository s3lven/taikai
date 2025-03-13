import {
  Bracket,
  BracketEditor,
  BracketStatusType,
  BracketType,
  Tournament,
} from "@/types"
import { create } from "zustand"
import { useChangeTrackingStore } from "./change-tracking-store"
import { immer } from "zustand/middleware/immer"
import { useMatchesStore } from "./matches-store"
import { useParticipantStore } from "./participant-store"

interface BracketState {
  bracket: BracketEditor
  initialBracket: BracketEditor
}

interface BracketActions {
  setBracket: (
    bracket: Bracket,
    tournament: Omit<Tournament, "brackets">
  ) => void
  runBracket: () => void
  resetBracket: () => void
  completeBracket: () => void
  reopenBracket: () => void
  updateProgress: () => void
  setBracketName: (name: string) => void
  setBracketType: (type: BracketType) => void
  generateBracketChanges: () => void
}

type BracketStore = BracketState & BracketActions

export const useBracketStore = create<BracketStore>()(
  immer((set, get) => ({
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
    initialBracket: {
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
        }
        state.initialBracket = {
          ...state.initialBracket,
          ...bracket,
          tournamentName: tournament.name,
        }
      }),
    runBracket: () => {
      set((state) => {
        const participants = useParticipantStore.getState().participants

        // Check if any participant name is empty
        const hasEmptyName = participants.some(
          (participant) => !participant.name
        )
        if (hasEmptyName) {
          // TODO: Send a toast instead of an alert
          alert("Fill out all of the required participant names")
          return state // Early return, no state update
        }
        state.bracket = {
          ...state.bracket,
          status: "In Progress" as BracketStatusType,
          progress: 0,
        }
        useChangeTrackingStore.setState({ hasUnsavedChanges: true })
      })
    },
    resetBracket: () =>
      set((state) => {
        state.bracket = {
          ...state.bracket,
          status: "Editing",
          progress: 0,
        }
        useMatchesStore.getState().resetBracket()
        useChangeTrackingStore.setState({ hasUnsavedChanges: true })
      }),
    completeBracket: () =>
      set((state) => {
        state.bracket = {
          ...state.bracket,
          status: "Completed",
        }
        useChangeTrackingStore.setState({ hasUnsavedChanges: true })
      }),
    reopenBracket: () =>
      set((state) => {
        state.bracket = {
          ...state.bracket,
          status: "In Progress",
        }
        useChangeTrackingStore.setState({ hasUnsavedChanges: true })
      }),
    updateProgress: () => {
      const matches = useMatchesStore.getState().rounds.flat()
      let totalMatches = 0
      let completedMatches = 0

      matches.forEach((match) => {
        if (!match.byeMatch) {
          totalMatches++
          if (match.winner) completedMatches++
        }
      })

      console.log(completedMatches)

      const progress =
        totalMatches > 0
          ? Math.round((completedMatches / totalMatches) * 100)
          : 0
      set((state) => {
        state.bracket.progress = progress
        useChangeTrackingStore.setState({ hasUnsavedChanges: true })
      })
    },
    setBracketName: (name: string) =>
      set((state) => {
        const newState = { bracket: { ...state.bracket, name } }
        useChangeTrackingStore.setState({ hasUnsavedChanges: true })

        return newState
      }),
    setBracketType: (type: BracketType) =>
      set((state) => {
        state.bracket = { ...state.bracket, type }
        useChangeTrackingStore.setState({ hasUnsavedChanges: true })
      }),
    generateBracketChanges: () => {
      const state = get()
      const changeTracker = useChangeTrackingStore.getState()

      const { bracket, initialBracket } = state

      if (bracket.name !== initialBracket.name) {
        changeTracker.addChange({
          entityType: "bracket",
          changeType: "update",
          entityId: bracket.id,
          payload: { name: bracket.name },
        })
      }

      if (bracket.type !== initialBracket.type) {
        changeTracker.addChange({
          entityType: "bracket",
          changeType: "update",
          entityId: bracket.id,
          payload: { type: bracket.type },
        })
      }

      // if (bracket.status !== initialBracket.status) {
      //   changeTracker.addChange({
      //     entityType: "bracket",
      //     changeType: "update",
      //     entityId: bracket.id,
      //     payload: { status: bracket.status },
      //   });
      // }
    },
  }))
)
