import { Bracket, BracketData } from "@/types";
import { create } from "zustand";


interface BracketState {
    bracket: Bracket & { tournamentName: string };
}

interface BracketActions {
    // setBracket: (bracket: Bracket) => void;
    fetchBracketData: (bracketId: number) => Promise<void>;
    setBracketName: (name: string) => void;
    setBracketType: (type: string) => void;
}

export type BracketStore = BracketState & BracketActions;

export const useBracketStore = create<BracketStore>((set) => ({
    bracket: {
        id: 0,
        name: "",
        status: "Upcoming",
        numberOfParticipants: 0,
        type: "Single Elimination",
        tournamentName: "",
    },
    // setBracket: (bracket: Bracket) => set({ bracket }),
    fetchBracketData: async (bracketId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/brackets/${bracketId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch bracket data");
            }
            const data: BracketData = (await response.json()) as unknown as BracketData;
            const newBracket: Bracket & {tournamentName: string} = {
                id: data.id,
                name: data.name,
                status: data.status,
                numberOfParticipants: data.participantCount,
                type: data.type,
                tournamentName: data.tournamentName
            }
            set({ bracket: newBracket });
        } catch (error) {
            console.error(error);
        }
    },
    setBracketName: (name: string) => set((state) => ({ bracket: { ...state.bracket, name } })),
    setBracketType: (type: string) => set((state) => ({ bracket: { ...state.bracket, type } })),
}))