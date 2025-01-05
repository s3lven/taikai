import { Bracket, BracketData, BracketStatusType } from "@/types";
import { create } from "zustand";
import { useChangeTrackingStore } from "./change-tracking-store";
import { immer } from "zustand/middleware/immer";
import { useMatchesStore } from "./matches-store";

interface BracketState {
	bracket: Bracket & { tournamentName: string };
	isLoading: boolean
	error: Error | null
	isInitialized: boolean
}

interface BracketActions {
	fetchBracketData: (bracketId: number) => Promise<void>;
	runBracket: () => void;
	resetBracket: () => void;
	completeBracket: () => void;
	reopenBracket: () => void;
	updateProgress: (progress: number) => void;
	testBracket: () => void;
	setBracketName: (name: string) => void;
	setBracketType: (type: string) => void;
}

type BracketStore = BracketState & BracketActions;

export const useBracketStore = create<BracketStore>()(
	immer((set) => ({
		bracket: {
			id: 0,
			name: "",
			status: "Editing" as BracketStatusType,
			participantCount: 0,
			type: "Single Elimination",
			tournamentName: "",
			progress: 0,
		},
		isLoading: false,
		error: null,
		isInitialized: false,
		
		fetchBracketData: async (bracketId: number) => {
			set({ isLoading: true })
			try {
				const response = await fetch(
					`http://localhost:3001/api/brackets/${bracketId}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch bracket data");
				}
				const data: BracketData =
					(await response.json()) as unknown as BracketData;
				const newBracket: Bracket & { tournamentName: string } = {
					id: data.id,
					name: data.name,
					status: data.status,
					participantCount: data.participantCount,
					type: data.type,
					progress: data.progress,
					tournamentName: data.tournamentName,
				};
				set({ bracket: newBracket, isInitialized: true });
			} catch (error) {
				console.error(error);
				set({ error: error as Error });
			} finally {
				set({ isLoading: false})
			}
		},
		runBracket: () =>
			set((state) => {
				const newState = {
					bracket: {
						...state.bracket,
						status: "In Progress" as BracketStatusType,
						progress: 0,
					},
				};
				useChangeTrackingStore.getState().addChange({
					entityType: "bracket",
					changeType: "update",
					entityId: state.bracket.id,
					payload: { status: "In Progress", progress: 0 },
				});
				return newState;
			}),
		resetBracket: () =>
			set((state) => {
				const newState = {
					bracket: {
						...state.bracket,
						status: "Editing" as BracketStatusType,
						progress: 0,
					},
				};
				useChangeTrackingStore.getState().addChange({
					entityType: "bracket",
					changeType: "update",
					entityId: state.bracket.id,
					payload: { status: "Editing" },
				});
				useMatchesStore.getState().resetBracket();
				return newState;
			}),
		completeBracket: () =>
			set((state) => {
				const newState = {
					bracket: {
						...state.bracket,
						status: "Completed" as BracketStatusType,
					},
				};
				useChangeTrackingStore.getState().addChange({
					entityType: "bracket",
					changeType: "update",
					entityId: state.bracket.id,
					payload: { status: "Completed" },
				});
				return newState;
			}),
		reopenBracket: () =>
			set((state) => {
				const newState = {
					bracket: {
						...state.bracket,
						status: "In Progress" as BracketStatusType,
					},
				};
				useChangeTrackingStore.getState().addChange({
					entityType: "bracket",
					changeType: "update",
					entityId: state.bracket.id,
					payload: { status: "In Progress" },
				});
				return newState;
			}),
		updateProgress: (progress: number) =>
			set((state) => {
				state.bracket.progress = progress;
			}),
		testBracket: () => {
			set((state) => {
				if (state.bracket.progress !== 100) {
					const newProgress = Math.min(state.bracket.progress + 10, 100);
					useChangeTrackingStore.getState().addChange({
						entityType: "bracket",
						changeType: "update",
						entityId: state.bracket.id,
						payload: { progress: newProgress },
					});
					return {
						bracket: {
							...state.bracket,
							progress: newProgress,
						},
					};
				}
				return state;
			});
		},
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
