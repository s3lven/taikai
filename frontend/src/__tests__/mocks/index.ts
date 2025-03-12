import { Bracket, CreateTournamentForm, Tournament } from "@/types"

// Mock data for testing
const mockTournament: Tournament = {
  id: 1,
  name: "Test Tournament",
  status: "Active",
  brackets: [
    {
      id: 1,
      name: "Beginner Bracket",
      status: "Editing",
      tournamentID: 1,
      type: "Single Elimination",
    },
  ],
  location: "Test Location",
  date: "2024-02-29",
}

const mockBracket: Bracket = {
  id: 1,
  name: "Test Bracket",
  status: "Editing",
  tournamentID: 1,
  type: "Single Elimination",
}

const createMockTournament: CreateTournamentForm = {
  name: "Test Tournament",
  location: "Test Location",
  date: "2024-02-29",
}

export { mockTournament, mockBracket, createMockTournament }
