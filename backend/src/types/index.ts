interface Tournament {
  id: number;
  name: string;
  status: string;
  location: string;
  date: Date;
  participantCount: number;
}

interface Bracket {
  id: number;
  name: string;
  status: string;
  participantCount: number;
  tournamentId: number;
}

interface TournamentWithBrackets {
  brackets: Bracket[];
}

interface TournamentAccumulator {
  [key: number]: TournamentWithBrackets;
}

type TournamentUpdateData = Omit<Tournament, "id">
type BracketWithTournamentName = Bracket & {tournamentName: string}

export {Tournament, Bracket, TournamentWithBrackets, TournamentAccumulator, TournamentUpdateData, BracketWithTournamentName}