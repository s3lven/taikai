import { relations } from "drizzle-orm/relations";
import { tournaments, brackets } from "./schema";

export const bracketsRelations = relations(brackets, ({one}) => ({
	tournament: one(tournaments, {
		fields: [brackets.tournamentId],
		references: [tournaments.id]
	}),
}));

export const tournamentsRelations = relations(tournaments, ({many}) => ({
	brackets: many(brackets),
}));