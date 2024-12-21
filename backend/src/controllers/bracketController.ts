import { Request, Response } from 'express';
import { db } from '../database';
import { tournaments, brackets } from '../database/schema';
import { eq } from 'drizzle-orm';
import { BracketWithTournamentName } from '../types';

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
      .values({ name, status: 'Pending', participantCount: 0, tournamentId })
      .returning({ id: brackets.id })

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
