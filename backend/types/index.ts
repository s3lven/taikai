import {
  Bracket,
  BracketStatusType,
  BracketType,
} from "../models/bracketModel";
import { BracketParticipant } from "../models/bracketParticipantModel";
import { Participant } from "../models/participantModel";
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

export type ClientParticipant = Participant &
  Pick<BracketParticipant, "sequence">;
