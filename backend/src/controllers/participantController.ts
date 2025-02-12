import { Request, Response } from 'express';
import { getParticipantsByBracketId } from '../utils/createInitialMatches';

export const getParticipants = async (req: Request, res: Response) => {
  console.info('[INFO]: Fetching bracket');
  try {
    // Extract the id from the request parameters
    const bracketId = parseInt(req.params.id as string);

    // Fetch participants associated with the bracket
    const bracketParticipants = await getParticipantsByBracketId(bracketId)

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
  }
  console.info('[INFO]: Finished fetching participants');
};
