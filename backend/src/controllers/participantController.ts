import { Request, Response } from 'express';
import { db } from '../database';
import { participants, participantsBracket } from '../database/schema';
import { eq } from 'drizzle-orm';

export const getParticipants = async (req: Request, res: Response) => {
  console.info('[INFO]: Fetching bracket');
  try {
    // Extract the id from the request parameters
    const bracketId = parseInt(req.params.id as string);

    if (isNaN(bracketId)) {
      res.status(400).json({
        error: 'Invalid bracket ID provided',
      });
      return;
    }

    // Fetch participants associated with the bracket
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

    // If participants exist, return them
    if (bracketParticipants.length > 0) {
      res.status(200).json({
        participants: bracketParticipants,
      });
      return;
    }

    // Generate default participants if none exist
    const defaultParticipants = Array.from({ length: 2 }, (_, i) => ({
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

    // Return the newly created participants
    res.status(200).json({participants: newParticipants});
  } catch (error) {
    console.error('Error fetching participants:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch participants' });
    }
    return;
  }
  console.info('[INFO]: Finished fetching participants');
};
