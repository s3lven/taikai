export type BracketStatusType = "Editing" | "In Progress" | "Completed";

export interface Bracket {
  id: number;
  name: string;
  status: BracketStatusType;
  participantCount: number;
  type: string;
  progress: number;
}
