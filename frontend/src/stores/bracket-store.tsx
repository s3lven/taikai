import { Bracket, BracketData } from "@/types";
import { create } from "zustand";

interface BracketState {
	bracket: Bracket & { tournamentName: string };
}

interface BracketActions {
	// setBracket: (bracket: Bracket) => void;
	fetchBracketData: (bracketId: number) => Promise<void>;
	runBracket: () => void;
	resetBracket: () => void;
	completeBracket: () => void;
	reopenBracket: () => void;
	testBracket: () => void;
	setBracketName: (name: string) => void;
	setBracketType: (type: string) => void;
}

export type BracketStore = BracketState & BracketActions;

export const useBracketStore = create<BracketStore>((set) => ({
	bracket: {
		id: 0,
		name: "",
		status: "In Progress",
		numberOfParticipants: 0,
		type: "Single Elimination",
		tournamentName: "",
		progress: 0,
	},
	// setBracket: (bracket: Bracket) => set({ bracket }),
	fetchBracketData: async (bracketId: number) => {
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
				numberOfParticipants: data.participantCount,
				type: data.type,
				progress: data.progress,
				tournamentName: data.tournamentName,
			};
			set({ bracket: newBracket });
		} catch (error) {
			console.error(error);
		}
	},
	runBracket: () =>
		set((state) => ({
			bracket: { ...state.bracket, status: "In Progress", progress: 0 },
		})),
	resetBracket: () =>
		set((state) => ({ bracket: { ...state.bracket, status: "Editing" } })),
	completeBracket: () =>
		set((state) => ({ bracket: { ...state.bracket, status: "Completed" } })),
	reopenBracket: () =>
		set((state) => ({ bracket: { ...state.bracket, status: "In Progress" } })),
	testBracket: () => {
		set((state) => {
			if (state.bracket.progress !== 100) {
				return {
					bracket: {
						...state.bracket,
						progress: Math.min(state.bracket.progress + 10, 100),
					},
				};
			}
			return state;
		});
	},
	setBracketName: (name: string) =>
		set((state) => ({ bracket: { ...state.bracket, name } })),
	setBracketType: (type: string) =>
		set((state) => ({ bracket: { ...state.bracket, type } })),
}));
