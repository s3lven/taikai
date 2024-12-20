import { Bracket, CreateTournament, Tournament } from "@/types";

// Mock data for testing
const mockTournament: Tournament = {
	id: 1,
	name: "Test Tournament",
	status: "Active",
	brackets: [
		{
			id: 1,
			name: "Beginner Bracket",
			status: "Active",
			numberOfParticipants: 10,
		},
	],
	location: "Test Location",
	date: "2024-02-29",
	numberOfParticipants: 25,
};

const mockBracket: Bracket = {
	id: 1,
	name: "Test Bracket",
	status: "Active",
	numberOfParticipants: 10,
};

const createMockTournament : CreateTournament = {
  name: "Test Tournament",
	status: "Active",
  location: "Test Location",
	date: "2024-02-29",
	numberOfParticipants: 25,
}

export { mockTournament, mockBracket, createMockTournament };
