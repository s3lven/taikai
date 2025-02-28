export type BracketStatusType = "Editing" | "In Progress" | "Completed";
export type BracketType = "Single Elimination" | "Double Elimination" | "Round Robin" | "Swiss"
 
export interface Bracket {
  id: number;
  tournament_id: number;
  name: string;
  status: BracketStatusType;
  type: BracketType;
}
