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
    const tournamentData= await db
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
