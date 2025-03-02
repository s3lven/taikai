import { Participant } from "@/types";
import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useChangeTrackingStore } from "./change-tracking-store";
import { useBracketStore } from "./bracket-store";

interface ParticipantState {
  participants: Participant[];
  initialParticipants: Participant[];
}

interface ParticipantActions {
  addParticipant: () => void;
  removeParticipant: (id: number) => void;
  updateParticipant: (id: number, name: string) => void;
  moveParticipant: (oldIndex: number, newIndex: number) => void;
  shuffleParticipants: () => void;
  updateParticipantName: (id: number, name: string) => void;
  setParticipants: (participants: Participant[]) => void;
  generateParticipantChanges: () => void;
}

type ParticipantStore = ParticipantState & ParticipantActions;

export const useParticipantStore = create<ParticipantStore>()(
  immer((set, get) => ({
    participants: [],
    initialParticipants: [],
    isLoading: false,

    setParticipants: (participants: Participant[]) => {
      set((state) => {
        state.participants = participants;
        state.initialParticipants = participants;
      });
    },
    addParticipant: () => {
      set((state) => {
        const newId = state.participants.length
          ? Math.max(...state.participants.map((p) => p.id)) + 1
          : 1;

        if (state.participants.length < 32) {
          const newParticipant = {
            id: newId,
            sequence: state.participants.length + 1,
            name: `Player ${state.participants.length + 1}`,
          };
          state.participants = [...state.participants, newParticipant];
        }
        useChangeTrackingStore.setState({ hasUnsavedChanges: true });
      });
    },
    removeParticipant: (id) => {
      set((state) => {
        state.participants = state.participants
          .filter((participant) => participant.id !== id)
          .map((participant, index) => ({
            ...participant,
            sequence: index + 1,
          }));
        useChangeTrackingStore.setState({ hasUnsavedChanges: true });
      });
    },
    updateParticipant: (id, name) =>
      set((state) => {
        const participant = state.participants.find(
          (participant) => participant.id === id
        );
        if (participant) {
          participant.name = name;
        }
        useChangeTrackingStore.setState({ hasUnsavedChanges: true });
      }),
    moveParticipant: (oldIndex, newIndex) =>
      set((state) => {
        const updated = arrayMove(state.participants, oldIndex, newIndex).map(
          (participant, index) => ({ ...participant, sequence: index + 1 })
        );
        state.participants = updated;
        useChangeTrackingStore.setState({ hasUnsavedChanges: true });
      }),
    shuffleParticipants: () => {
      set((state) => {
        // Shuffle the participants array
        const shuffledParticipants = state.participants
          .map((participant) => ({ ...participant }))
          .sort(() => Math.random() - 0.5);

        // Update the sequence property
        shuffledParticipants.forEach((participant, index) => {
          participant.sequence = index + 1;
        });

        state.participants = shuffledParticipants;
        useChangeTrackingStore.setState({ hasUnsavedChanges: true });
      });
    },
    updateParticipantName: (id, name) => {
      set((state) => {
        const participant = state.participants.find(
          (participant) => participant.id === id
        );
        if (participant) {
          participant.name = name;
        }
        useChangeTrackingStore.setState({ hasUnsavedChanges: true });
      });
    },
    generateParticipantChanges: () => {
      const state = get();
      const { participants, initialParticipants } = state;
      const changeTracker = useChangeTrackingStore.getState();
      const bracketId = useBracketStore.getState().bracket.id; // Get bracket ID

      // Track deletions
      initialParticipants.forEach((initial) => {
        if (!participants.find((p) => p.id === initial.id)) {
          changeTracker.addChange({
            entityType: "participant",
            changeType: "delete",
            entityId: initial.id,
            payload: {
              ...initial,
              bracketId,
            },
          });
        }
      });

      // Track additions and updates
      participants.forEach((current) => {
        const initial = initialParticipants.find((p) => p.id === current.id);

        if (!initial) {
          // New participant
          changeTracker.addChange({
            entityType: "participant",
            changeType: "create",
            entityId: current.id,
            payload: {
              ...current,
              bracketId,
            },
          });
        } else {
          // Check for updates
          const changes: Record<string, unknown> = {};
          let hasChanges = false;

          if (current.name !== initial.name) {
            changes.name = current.name;
            hasChanges = true;
          }
          if (current.sequence !== initial.sequence) {
            changes.sequence = current.sequence;
            hasChanges = true;
          }

          if (hasChanges) {
            changeTracker.addChange({
              entityType: "participant",
              changeType: "update",
              entityId: current.id,
              payload: {
                ...changes,
                bracketId,
              },
            });
          }
        }
      });
    },
  }))
);
