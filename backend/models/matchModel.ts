import { ClientParticipant } from "../types";

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
  player1: ClientParticipant | null;
  player2: ClientParticipant | null;
  player1_score: IpponType[];
  player2_score: IpponType[];
  winner: ClientParticipant | null;
  round: number;
  match: number;
  bye_match: boolean
}
