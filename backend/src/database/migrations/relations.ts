import { relations } from "drizzle-orm/relations";
import { tournaments, brackets, participants, participantsBracket } from "./schema";

export const bracketsRelations = relations(brackets, ({one, many}) => ({
	tournament: one(tournaments, {
		fields: [brackets.tournamentId],
		references: [tournaments.id]
	}),
	participantsBrackets: many(participantsBracket),
}));

export const tournamentsRelations = relations(tournaments, ({many}) => ({
	brackets: many(brackets),
}));

export const participantsBracketRelations = relations(participantsBracket, ({one}) => ({
	participant: one(participants, {
		fields: [participantsBracket.participantId],
		references: [participants.id]
	}),
	bracket: one(brackets, {
		fields: [participantsBracket.bracketId],
		references: [brackets.id]
	}),
}));

export const participantsRelations = relations(participants, ({many}) => ({
	participantsBrackets: many(participantsBracket),
}));