import { BracketStatusType, BracketType } from "../models/bracketModel"
import { BracketParticipant } from "../models/bracketParticipantModel"
import { IpponType } from "../models/matchModel"
import { Participant } from "../models/participantModel"
import { TournamentStatusType } from "../models/tournamentModel"

export interface TournamentDTO {
	id: number
	name: string
	status: TournamentStatusType
	location: string
	date: string
}

export interface BracketDTO {
	id: number
	tournamentID: number
	name: string
	status: BracketStatusType
	type: BracketType
}

export type ClientParticipant = Participant &
	Pick<BracketParticipant, "sequence">

export interface MatchDTO {
	id: number
	bracketID: number
	player1: ClientParticipant | null
	player2: ClientParticipant | null
	player1Score: IpponType[]
	player2Score: IpponType[]
	winner: ClientParticipant | null
	firstScorer: ClientParticipant | null
	round: number
	match: number
	byeMatch: boolean
  hasHansoku: boolean
}
