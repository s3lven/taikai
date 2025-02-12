import { eq } from 'drizzle-orm';
import { db } from '../database';
import { matches, participants, participantsBracket } from '../database/schema';

export interface Match {
  id?: number;
  player1: Participant | null;
  player2: Participant | null;
  player1Score: IpponType[];
  player2Score: IpponType[];
  winner: Participant | null;
  roundNumber: number;
  position: number;
}

export interface Participant {
  id: number;
  sequence: number;
  name: string;
}

export type IpponType = 'Men' | 'Kote' | 'Do' | 'Tsuki' | 'Hantei' | 'Hansoku' | 'None';

export async function getParticipantsByBracketId(bracketId: number) {
  if (isNaN(bracketId)) {
    throw new Error('Invalid bracket ID provided');
  }

  const bracketParticipants = await db
    .select({
      id: participants.id,
      name: participants.name,
      sequence: participantsBracket.sequence,
    })
    .from(participantsBracket)
    .leftJoin(participants, eq(participants.id, participantsBracket.participantId))
    .where(eq(participantsBracket.bracketId, bracketId))
    .orderBy(participantsBracket.sequence);

  if (bracketParticipants.length > 0) {
    return bracketParticipants as Participant[];
  } else {
    throw new Error(`No participants found in bracket ${bracketId}`);
  }
}

export async function generateNewParticipants(bracketId: number) {
  // Generate default participants if none exist
  const defaultParticipants = Array.from({ length: 4 }, (_, i) => ({
    name: `Player ${i + 1}`,
  }));

  // Insert participants into the `participants` table
  const insertedParticipants = await db
    .insert(participants)
    .values(defaultParticipants)
    .returning();

  // Associate participants with the bracket in `participants_bracket`
  const associations = insertedParticipants.map((participant, index) => ({
    participantId: participant.id,
    bracketId,
    sequence: index + 1,
  }));

  await db.insert(participantsBracket).values(associations);

  const newParticipants = await db
    .select({
      id: participants.id,
      name: participants.name,
      sequence: participantsBracket.sequence,
    })
    .from(participantsBracket)
    .leftJoin(participants, eq(participants.id, participantsBracket.participantId))
    .where(eq(participantsBracket.bracketId, bracketId))
    .orderBy(participantsBracket.sequence);

  return newParticipants as Participant[];
}

export default async function insertInitialMatches(bracketId: number) {
  const participants = await generateNewParticipants(bracketId);
  console.log('Inserted new participants');
  if (!participants) throw new Error(`There are no participants for bracketId ${bracketId}`);

  if (participants.length < 2) return [];

  const initialMatches = [
    [
      {
        player1: participants[0],
        player2: participants[1],
        roundNumber: 0,
        position: 0,
      },
      {
        player1: participants[2],
        player2: participants[3],
        roundNumber: 0,
        position: 1,
      },
    ],
  ];

  //   Add matches to database
  const matchesToDatabase = initialMatches.flat().map((match) => ({
    bracketId,
    player1: match.player1?.id,
    player2: match.player2?.id,
    winnerId: null,
    roundNumber: match.roundNumber,
    position: match.position,
  }));

  await db.insert(matches).values(matchesToDatabase);
  return initialMatches.flat();
}
