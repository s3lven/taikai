export type TournamentStatusType = "Active" | "Upcoming" | "Past";
export type BracketRoundType =
	| `Round ${number}`
	| "Quarter-Finals"
	| "Semi-Finals"
	| "Finals";
type IpponType = "Men" | "Kote" | "Do" | "Tsuki" | "Hantei" | "Hansoku" | "";

export interface Tournament {
	id: number;
	name: string;
	status: TournamentStatusType;
	location: string;
	date: string;
	numberOfParticipants: number;
	brackets: Bracket[];
}
export type CreateTournament = Omit<Tournament, "brackets" | "id">;

export type BracketStatusType = "Editing" | "In Progress" | "Completed";
export interface Bracket {
	id: number;
	name: string;
	status: BracketStatusType;
	numberOfParticipants: number;
	type: string;
	progress: number;
	// participants: Participant[]
}

export type BracketData = Omit<Bracket, "numberOfParticipants"> & {
	tournamentName: string;
	participantCount: number;
};

export interface Match {
	id?: number;
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

// const dummyTournamentData: Tournament[] = [
// 	{
//         id: 1,
// 		name: "Sac Taikai",
// 		status: "Active",
//         location: "Sacramento, CA",
//         date: "2024-03-15",
//         numberOfParticipants: 36,
//         brackets: [
//             {
//                 id: 1,
//                 name: "Kyu",
//                 status: "Past",
//                 numberOfParticipants: 16,
//                 type: "Single Elimination"
//             },
//             {
//                 id: 2,
//                 name: "Dan",
//                 status: "Active",
//                 numberOfParticipants: 20,
//                 type: "Single Elimination"
//             }
//         ]
// 	},
// 	{
//         id: 2,
// 		name: "HSSK Taikai",
// 		status: "Active",
//         location: "Newark, CA",
//         date: "2024-05-12",
//         numberOfParticipants: 42,

//         brackets: [
//             {
//                 id: 1,
//                 name: "Kyu",
//                 status: "Active",
//                 numberOfParticipants: 18,
//                 type: "Single Elimination"
//             },
//             {
//                 id: 2,
//                 name: "Dan",
//                 status: "Upcoming",
//                 numberOfParticipants: 24,
//                 type: "Single Elimination"
//             }
//         ]
// 	},
// ];
