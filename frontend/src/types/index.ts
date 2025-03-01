// Constants
export type TournamentStatusType = "Active" | "Upcoming" | "Past";
export type BracketRoundType =
	| `Round ${number}`
	| "Quarter-Finals"
	| "Semi-Finals"
	| "Finals";
export type IpponType = "Men" | "Kote" | "Do" | "Tsuki" | "Hantei" | "Hansoku" | "None";
export const hitMap: Record<IpponType, string> = {
	Men: "M",
	Kote: "K",
	Do: "D",
	Tsuki: "T",
	Hantei: "HT",
	Hansoku: "HS",
	None: "",
};
export type BracketType = "Single Elimination" | "Double Elimination" | "Round Robin" | "Swiss"
export type BracketStatusType = "Editing" | "In Progress" | "Completed";
export type PlayerColorType = "Red" | "White"


export interface Tournament {
	id: number;
	name: string;
	status: TournamentStatusType;
	location: string;
	date: string;
	// participantCount: number;
	brackets: Bracket[];
}
export type CreateTournament = Omit<Tournament, "brackets" | "id">;


export interface Bracket {
	id: number;
	name: string;
	status: BracketStatusType;
	// participantCount: number;
	type: BracketType;
	// progress: number;
}

export type BracketData = Bracket & {
	tournamentName: string;
};

export interface Match {
	id: number;
	player1: Participant | null;
	player2: Participant | null;
	player1Score: IpponType[];
	player2Score: IpponType[];
	winner: Participant | null
}

export interface Participant {
	id: number;
	sequence: number;
	name: string;
}
export interface ParticipantsData {
	participants: Participant[]
};