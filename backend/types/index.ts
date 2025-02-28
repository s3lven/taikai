import {
  Bracket,
  BracketStatusType,
  BracketType,
} from "../models/bracketModel";
import { TournamentStatusType } from "../models/tournamentModel";

export interface TournamentDTO {
  id: number;
  name: string;
  status: TournamentStatusType;
  location: string;
  date: string;
  // brackets: Bracket[]
}

export interface BracketDTO {
  id: number;
  tournamentID: number;
  name: string;
  status: BracketStatusType;
  type: BracketType;
}
