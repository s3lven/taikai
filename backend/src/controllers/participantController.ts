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

    res.status(200).json({
      participants: bracketParticipants,
    });
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
