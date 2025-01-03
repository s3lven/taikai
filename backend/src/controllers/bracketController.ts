import { Request, Response } from 'express';
import { db } from '../database';
import { tournaments, brackets, participants, participantsBracket } from '../database/schema';
import { and, eq } from 'drizzle-orm';
import { BracketWithTournamentName } from '../types';
import { Change, ChangeType } from '../types/changes';

export const getBracket = async (req: Request, res: Response) => {
  console.info('[INFO]: Fetching bracket');
  try {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Fetch the bracket data from the database
    const data: Partial<BracketWithTournamentName>[] = await db
      .select()
      .from(brackets)
      .where(eq(brackets.id, parseInt(id)))
      .limit(1);

    // Grab the tournament name from the tournament table
    const tournamentData = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, data[0].tournamentId as number))
      .limit(1);

    // Add the tournament name to the bracket data
    data[0].tournamentName = tournamentData[0].name;
    console.log(data[0]);

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error fetching bracket:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch bracket' });
    }
    return;
  }
  console.info('[INFO]: Finished fetching bracket');
};

export const addBracket = async (req: Request, res: Response) => {
  console.info('[INFO]: Adding bracket');
  try {
    const { name, tournamentId } = req.body;

    // Insert the new bracket into the database with default status, location, date (now), and participant count
    const [newBracket] = await db
      .insert(brackets)
      .values({ name, status: 'Editing', participantCount: 0, tournamentId })
      .returning({ id: brackets.id });

    res.status(201).json({ id: newBracket.id });
  } catch (error) {
    console.error('Error adding bracket:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to add bracket' });
    }
    return;
  }
};

export const deleteBracket = async (req: Request, res: Response) => {
  console.info('[INFO]: Deleting bracket');
  try {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Delete the bracket from the database
    await db.delete(brackets).where(eq(brackets.id, parseInt(id)));

    res.status(200).json({ message: 'Bracket deleted successfully' });
  } catch (error) {
    console.error('Error deleting bracket:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete bracket' });
    }
    return;
  }
  console.info('[INFO]: Finished deleting bracket');
};

const processBracketChange = async (
  changeType: string,
  bracketId: number,
  payload: any,
  trx: Parameters<Parameters<typeof db.transaction>[0]>[0],
) => {
  switch (changeType) {
    case 'update':
      await trx.update(brackets).set(payload).where(eq(brackets.id, bracketId));
      break;
    default:
      throw new Error(`Unsupported change type for bracket: ${changeType}`);
  }
};

const processParticipantsChange = async (
  changeType: ChangeType,
  participantId: number,
  payload: any,
  trx: Parameters<Parameters<typeof db.transaction>[0]>[0],
) => {
  switch (changeType) {
    case 'update':
      if (payload.name) {
        // Update participant name
        await trx
          .update(participants)
          .set({ name: payload.name })
          .where(eq(participants.id, participantId));
      }

      if (payload.sequence) {
        // Update sequence in the junction table
        await trx
          .update(participantsBracket)
          .set({ sequence: payload.sequence })
          .where(
            and(
              eq(participantsBracket.participantId, participantId),
              eq(participantsBracket.bracketId, payload.bracketId),
            ),
          );
      }
      break;
    case 'create': 
    {
      // First create the participant
      const [newParticipant] = await trx
        .insert(participants)
        .values({
          name: payload.name,
        })
        .returning({ id: participants.id });

      // Then create the association in the junction table
      await trx.insert(participantsBracket).values({
        participantId: newParticipant.id,
        bracketId: payload.bracketId,
        sequence: payload.sequence,
      });
      break;
    }
    case 'delete':
      // The junction table entries will be automatically deleted due to ON DELETE CASCADE
      await trx.delete(participants).where(eq(participants.id, participantId));
      break;
    default:
      throw new Error(`Unsupported change type for participant: ${changeType}`);
  }
};

const processChange = async (
  change: Change,
  trx: Parameters<Parameters<typeof db.transaction>[0]>[0],
) => {
  const { entityType, changeType, entityId, payload } = change;

  switch (entityType) {
    case 'bracket':
      await processBracketChange(changeType, entityId, payload, trx);
      break;
    case 'participant':
      await processParticipantsChange(changeType, entityId, payload, trx);
      break;
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
};

export const batchUpdateBracket = async (req: Request, res: Response) => {
  console.info('[INFO]: Updating brackets');
  try {
    const { changes } = req.body;

    // Sort changes by timestamp to ensure correct order of operations
    const sortedChanges = changes.sort((a: Change, b: Change) => a.timestamp - b.timestamp);

    // Process changes in a transactions
    await db.transaction(async (trx) => {
      for (const change of sortedChanges) {
        await processChange(change, trx);
      }
    });

    res.status(200).json({ message: 'Brackets updated successfully' });
  } catch (error) {
    console.error('Error updating brackets:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update brackets' });
    }
    return;
  }
  console.info('[INFO]: Finished updating brackets');
};
