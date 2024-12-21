interface Tournament {
    id: number
	name: string;
	status: string;
    location: string;
    date: string;
    numberOfParticipants: number
    brackets: Bracket[]
}

type CreateTournament = Omit<Tournament, "brackets" | "id">

interface Bracket {
    id: number
    name: string
    status: string
    numberOfParticipants: number
    type: string
    // participants: Participant[]
}

type BracketData = Bracket & { tournamentName: string }

// interface Participant {
//     id: number
//     name: string
// }


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

export type { Tournament, CreateTournament, Bracket, BracketData };
// export { dummyTournamentData };
