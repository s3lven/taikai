import type { Request, Response } from "express";
import { db } from "../database";
import { matches } from "../database/schema";
import { eq } from "drizzle-orm";

export const getMatches = async (req: Request, res: Response) => {
    console.info('[INFO]: Fetching matches');
    try {
      // Extract the id from the request parameters
      const { id } = req.params;
  
      // Fetch the matches data from the database
      const data = await db
        .select({
            id: matches.id,
              player1: matches.player1,
              player2: matches.player2,
              player1Score: matches.player1Score,
              player2Score: matches.player2Score,
              winner: matches.winner,
              roundNumber: matches.roundNumber,
              position: matches.position,
        })
        .from(matches)
        .where(eq(matches.bracketId, parseInt(id)))
  
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch matches' });
      }
      return;
    }
    console.info('[INFO]: Finished fetching matches');
  };