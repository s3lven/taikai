import { NextFunction, Request, Response } from "express";
import { tournamentService } from "../services/tournamentService";
import { AppError } from "../utils/AppError";

export class TournamentController {
  async getTournaments(req: Request, res: Response, next: NextFunction) {
    console.info("[INFO]: Getting all tournaments");
    try {
      const tournaments = await tournamentService.getTournaments();
      res.json({ message: "Getting Tournaments", payload: tournaments });
    } catch (error) {
      next(error);
    }
  }

  async createTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, location, date, participantCount } = req.body;
      console.info(`[INFO]: Creating new tournament ${name}`);
      if (!name || !location || !date || !participantCount) {
        throw new AppError("Required fields are missing", 400);
      }

      const newTournament = await tournamentService.createTournament({
        name,
        location,
        date,
        participant_count: participantCount,
      });
      res
        .status(201)
        .json({ message: "Creating Tournaments", payload: newTournament });
    } catch (error) {
      next(error);
    }
  }

  async deleteTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      console.info(`[INFO]: Deleting tourament ${id}`);
      await tournamentService.deleteTournament(id);
      res.status(204).json({ message: `Deleted tournament ${id}` });
    } catch (error) {
      next(error);
    }
  }
}

export const tournamentController = new TournamentController();
