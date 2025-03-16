import { NextFunction, Request, Response } from "express"
import { tournamentService } from "../services/tournamentService"
import { AppError } from "../utils/AppError"
import { Tournament } from "../models/tournamentModel"

export class TournamentController {
  async getTournaments(req: Request, res: Response, next: NextFunction) {
    console.info("[INFO]: Getting all tournaments")
    try {
      const supabase = req.supabase

      const tournaments = await tournamentService.getTournaments(supabase)
      res.json({ message: "Getting Tournaments", payload: tournaments })
    } catch (error) {
      next(error)
    }
  }

  async getUserTournaments(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user
      if (!user) {
        throw new AppError("Authentication required", 401)
      }
      console.info(`[INFO]: Getting all of the user ${req.user?.id} tournaments`)

      const tournaments = await tournamentService.getUserTournaments(user.id)
      res.json({ message: "Getting Tournaments", payload: tournaments })
    } catch (error) {
      next(error)
    }
  }

  async createTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, location, date } = req.body;
      console.info(`[INFO]: Creating new tournament ${name}`);
      if (!name || !location || !date) {
        throw new AppError("Required fields are missing", 400);
      }

      const newTournament = await tournamentService.createTournament({
        name,
        location,
        date,
      });
      res
        .status(201)
        .json({ message: "Creating Tournaments", payload: newTournament });
    } catch (error) {
      next(error);
    }
  }

  async editTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const tournamentID = parseInt(req.params.id);
      if (isNaN(tournamentID)) {
        throw new AppError(`Invalid tournament ID ${tournamentID}`);
      }
      const { name, location, date, status } = req.body;
      console.info(`[INFO]: Updating tournament ${tournamentID}`);

      if (!name || !location || !date || !status) {
        throw new AppError(`Required fields are missing`, 400);
      }

      const tournament: Partial<Tournament> = {
        name,
        location,
        date,
        status,
      };

      const updatedTournament = await tournamentService.editTournament(
        tournamentID,
        tournament
      );
      res.json({
        message: `Updated test ${tournamentID}`,
        payload: updatedTournament,
      });
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
