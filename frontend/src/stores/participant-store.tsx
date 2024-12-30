import { Participant, ParticipantsData } from "@/types";
import { arrayMove } from "@dnd-kit/sortable";
// import _ from "lodash";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
// import { useChangeTrackingStore } from "./change-tracking-store";

interface ParticipantState {
	participants: Participant[];
	initialParticipants: Participant[]
}

interface ParticipantActions {
	addParticipant: () => void;
	removeParticipant: (id: number) => void;
	updateParticipant: (id: number, name: string) => void;
	moveParticipant: (oldIndex: number, newIndex: number) => void;
	shuffleParticipants: () => void;
	setParticipants: (participants: Participant[]) => void;
	updateParticipantName: (id: number, name: string) => void;
	fetchParticipants: (bracketId: number) => Promise<void>;
}

type ParticipantStore = ParticipantState & ParticipantActions;

export const useParticipantStore = create<ParticipantStore>()(
	immer((set) => ({
		participants: [],
		initialParticipants: [],
		fetchParticipants: async (bracketId) => {
			try {
				const response = await fetch(
					`http://localhost:3001/api/participants/${bracketId}`
				);
				if (!response.ok) throw new Error("Failed to fetch participants");
				const data: ParticipantsData =
					(await response.json()) as unknown as ParticipantsData;
				set({ participants: data.participants });
				set({ initialParticipants: data.participants });

			} catch (error) {
				console.error(error);
			}
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
						name: "",
					};
					state.participants = [...state.participants, newParticipant];

					// useChangeTrackingStore.getState().addChange({
					// 	entityType: "participants",
					// 	changeType: "create",
					// 	entityId: newId,
					// 	payload: newParticipant,
					// });
				}
			});
		},
		removeParticipant: (id) => {
			// const participant = useParticipantStore.getState().participants.find(
			// 	(participant) => participant.id === id
			// );
			set((state) => {
				state.participants = state.participants
					.filter((participant) => participant.id !== id)
					.map((participant, index) => ({
						...participant,
						sequence: index + 1,
					}));
			});
			// useChangeTrackingStore.getState().addChange({
			// 	entityType: "participants",
			// 	changeType: "delete",
			// 	entityId: id,
			// 	payload: participant,
			// });
		},
		updateParticipant: (id, name) =>
			set((state) => {
				const participant = state.participants.find(
					(participant) => participant.id === id
				);
				if (participant) {
					participant.name = name;

					// useChangeTrackingStore.getState().addChange({
					// 	entityType: "participants",
					// 	changeType: "update",
					// 	entityId: id,
					// 	payload: { name },
					// });
				}
			}),
		moveParticipant: (oldIndex, newIndex) =>
			set((state) => {
				const updated = arrayMove(state.participants, oldIndex, newIndex).map(
					(participant, index) => ({ ...participant, sequence: index + 1 })
				);
				state.participants = updated;

				// useChangeTrackingStore.getState().addChange({
				// 	entityType: "participants",
				// 	changeType: "move",
				// 	entityId: updated[newIndex].id,
				// 	payload: state.participants,
				// });
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
			});
		},
		setParticipants: (participants) =>
			set((state) => {
				state.participants = participants;
			}),
		updateParticipantName: (id, name) =>
			set((state) => {
				const participant = state.participants.find(
					(participant) => participant.id === id
				);
				if (participant) {
					participant.name = name;
				}
			}),
	}))
);
