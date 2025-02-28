import { Bracket } from "../models/bracketModel";
import { TournamentStatusType } from "../models/tournamentModel";

export interface TournamentDTO {
    id: number;
	name: string;
	status: TournamentStatusType;
	location: string;
	date: string;
    // brackets: Bracket[]
}