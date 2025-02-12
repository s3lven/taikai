import {
  pgTable,
  serial,
  varchar,
  date,
  smallint,
  foreignKey,
  integer,
  primaryKey,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

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

export const participants = pgTable('participants', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
});

export const participantsBracket = pgTable(
  'participants_bracket',
  {
    participantId: integer('participant_id').notNull(),
    bracketId: integer('bracket_id').notNull(),
    sequence: smallint(),
  },
  (table) => [
    foreignKey({
      columns: [table.participantId],
      foreignColumns: [participants.id],
      name: 'participants_bracket_participant_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.bracketId],
      foreignColumns: [brackets.id],
      name: 'participants_bracket_bracket_id_fkey',
    }).onDelete('cascade'),
    primaryKey({
      columns: [table.participantId, table.bracketId],
      name: 'participants_bracket_pkey',
    }),
  ],
);

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  bracketId: integer('bracket_id').references(() => brackets.id, { onDelete: 'cascade' }),
  roundNumber: integer('round_number').notNull(),
  position: integer('position').notNull(),
  player1: integer('player1').references(() => participants.id),
  player2: integer('player2').references(() => participants.id),
  player1Score: jsonb('player1_score').default([]).notNull(),
  player2Score: jsonb('player2_score').default([]).notNull(),
  winner: integer('winner').references(() => participants.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const schema = { tournaments, brackets, participants, participantsBracket };
