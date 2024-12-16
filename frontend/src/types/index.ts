interface Tournament {
    id: number
	name: string;
	status: string;
    brackets: Bracket[]
}

interface Bracket {
    name: string
    status: string
    numberOfParticipants: number
}


const dummyTournamentData: Tournament[] = [
	{
        id: 1,
		name: "Sac Taikai",
		status: "Active",
        brackets: [
            {
                name: "Kyu",
                status: "Past",
                numberOfParticipants: 16
            },
            {
                name: "Dan",
                status: "Active",
                numberOfParticipants: 20
            }
        ]
	},
	{
        id: 2,
		name: "HSSK Taikai",
		status: "Active",
        brackets: [
            {
                name: "Kyu",
                status: "Active",
                numberOfParticipants: 18
            },
            {
                name: "Dan",
                status: "Upcoming",
                numberOfParticipants: 24
            }
        ]
	},
];

export type { Tournament, Bracket };
export { dummyTournamentData };
