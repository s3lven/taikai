export type TournamentStatusType = "Active" | "Upcoming" | "Past";

export interface Tournament {
  id: number;
  name: string;
  status: TournamentStatusType;
  location: string;
  date: string;
  participant_count: number;
}
