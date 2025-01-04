import { Request, Response } from 'express';
import { db } from '../database';
import { tournaments, brackets } from '../database/schema';
import { eq } from 'drizzle-orm';
import { Bracket, TournamentAccumulator, TournamentUpdateData } from '../types';

export const getAllTournaments = async (_req: Request, res: Response) => {
  console.info('[INFO]: Fetching tournaments');
  try {
    const data = await db
      .select()
      .from(tournaments)
      .leftJoin(brackets, eq(tournaments.id, brackets.tournamentId));

    // Transform the flat results into nested structure
    const transformedResults = data.reduce<TournamentAccumulator>((acc, row) => {
      const tournamentId: number = row.tournaments.id;

      if (!acc[tournamentId]) {
        acc[tournamentId] = {
          ...row.tournaments,
          brackets: [],
        };
      }

      if (row.brackets) {
        acc[tournamentId].brackets.push(row.brackets);
      }

      return acc;
    }, {});

    const results = Object.values(transformedResults);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
    return;
  }
  console.info('[INFO]: Finished fetching tournaments');
};

export const createTournament = async (req: Request, res: Response) => {
  console.log('[INFO]: Creating a new Tournament');
  try {
    const {
      name,
      status,
      location,
      date,
      participantCount,
      brackets: bracketData,
    } = req.body;

    // TODO: Add zod for proper validation -- adding participantCount (which is 0) makes the validation fail
    // Sanitize and Validate Input
    if (!name || !status || !location || !date) {
      console.info('CreateTournament parameters were not valid. Please check the request object.');
      res.status(400).json({ error: 'Please fill out all the required fields' });
      return;
    }

    const result = await db.transaction(async (tx) => {
      const [tournament] = await tx
        .insert(tournaments)
        .values({
          name,
          status,
          location,
          date,
          participantCount,
        })
        .returning();

      if (bracketData && Array.isArray(bracketData)) {
        await tx.insert(brackets).values(
          bracketData.map((bracket: Bracket) => ({
            ...bracket,
            tournamentId: tournament.id,
          })),
        );
      }

      const data = await tx
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, tournament.id))
        .leftJoin(brackets, eq(brackets.tournamentId, tournaments.id))
        .limit(1);

      // Transform the flat results into nested structure
      const transformedResults = data.reduce<TournamentAccumulator>((acc, row) => {
        const tournamentId: number = row.tournaments.id;

        if (!acc[tournamentId]) {
          acc[tournamentId] = {
            ...row.tournaments,
            brackets: [],
          };
        }

        if (row.brackets) {
          acc[tournamentId].brackets.push(row.brackets);
        }

        return acc;
      }, {});

      return Object.values(transformedResults)[0];
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating tournament:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create tournament' });
    }
    return;
  }
  console.log('[INFO]: Finished creating a new tournament');
};

export const deleteTournament = async (req: Request, res: Response) => {
  console.log('[INFO]: Deleting a Tournament');

  try {
    const tournamentId = req.params.id;

    // Validation
    if (!tournamentId) {
      console.error(`Tournament ID was not provided.`);
      res.status(400).json({ error: 'Tournament ID is required' });
      return;
    }

    if (typeof tournamentId !== 'string') {
      console.error(`Tournament ID ${tournamentId} is not a valid ID.`);
      res.status(400).json({ error: `Tournament ID ${tournamentId} is not a valid ID.` });
      return;
    }

    // Run the delete command
    const deletedUser = await db
      .delete(tournaments)
      .where(eq(tournaments.id, parseInt(tournamentId)))
      .returning();

    // Check if any user was deleted
    if (!deletedUser.length) {
      res.status(404).json({ error: `Tournament ${tournamentId} not found` });
      return;
    }

    res
      .status(200)
      .json({ message: `Tournament with id ${tournamentId} was successfully deleted` });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete tournament' });
    }
    return;
  }
  console.log('[INFO]: Finished deleting a new tournament');
};

export const updateTournament = async (req: Request, res: Response) => {
  console.log('[INFO]: Editting a new Tournament');
  try {
    const tournamentId = req.params.id;
    const allowedFields: (keyof TournamentUpdateData)[] = [
      'name',
      'status',
      'location',
      'date',
      'participantCount',
    ];

    // Sanitize and Validate Input
    if (!tournamentId) {
      console.error(`Tournament ID was not provided.`);
      res.status(400).json({ error: 'Tournament ID is required' });
      return;
    }

    if (typeof tournamentId !== 'string') {
      console.error(`Tournament ID ${tournamentId} is not a valid ID.`);
      res.status(400).json({ error: `Tournament ID ${tournamentId} is not a valid ID.` });
      return;
    }

    const updateData = Object.fromEntries(
      Object.entries(req.body as TournamentUpdateData)
        .filter(
          ([key, value]) =>
            allowedFields.includes(key as keyof TournamentUpdateData) && value !== undefined,
        )
        .map(([key, value]) => [key, key === 'date' ? new Date(value as string) : value]),
    );

    console.log(updateData)

    if (Object.keys(updateData).length === 0) {
      console.error('No update data was provided');
      res.status(400).json({ error: 'No update data was provided' });
      return;
    }

    const result = await db
      .update(tournaments)
      .set(updateData)
      .where(eq(tournaments.id, parseInt(tournamentId)))
      .returning();

    console.log(result)

    if (!result.length) {
      console.error('[Error]: Tournament not found');
      res.status(404).json({ error: `Tournament ${tournamentId} not found` });
      return;
    }

    res.status(201).json({message: `Tournament id ${tournamentId} was updated`, result});
  } catch (error) {
    console.error('Error creating tournament:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create tournament' });
    }
    return;
  }
  console.log('[INFO]: Finished editting a new tournament');
};
