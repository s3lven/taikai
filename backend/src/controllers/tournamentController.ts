import { Request, Response } from 'express';
import { db } from '../database';
import { tournaments } from '../database/schema';

export const getAllTournaments = async (req: Request, res: Response) => {
  try {
    const data = await db.select().from(tournaments);
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetchtournaments' });
    }
  }
};
