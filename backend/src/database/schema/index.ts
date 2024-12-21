import { pgTable, serial, varchar, date, smallint, foreignKey, integer } from 'drizzle-orm/pg-core';

export const tournaments = pgTable('tournaments', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 50 }).notNull(),
  status: varchar({ length: 50 }).notNull(),
  location: varchar({ length: 50 }).notNull(),
  date: date().notNull(),
  participantCount: smallint('participant_count').notNull(),
});

export const brackets = pgTable(
  'brackets',
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 50 }).notNull(),
    status: varchar({ length: 50 }).default('Editing').notNull(),
    participantCount: smallint('participant_count').default(0).notNull(),
    tournamentId: integer('tournament_id').notNull(),
    progress: smallint().default(0).notNull(),
    type: varchar({ length: 50 }).default('Single Elimination').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.tournamentId],
      foreignColumns: [tournaments.id],
      name: 'brackets_tournament_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const schema = { tournaments, brackets };
