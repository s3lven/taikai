
export type IpponType =
  | "Men"
  | "Kote"
  | "Do"
  | "Tsuki"
  | "Hantei"
  | "Hansoku"
  | "None";

export interface Match {
  id: number;
  bracket_id: number;
  player1_id: number | null;
  player2_id: number | null;
  player1_score: IpponType[];
  player2_score: IpponType[];
  winner_id: number | null;
  round: number;
  match: number;
  bye_match: boolean
}
