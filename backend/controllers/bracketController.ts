import { NextFunction, Request, Response } from "express";
import { bracketService } from "../services/bracketService";
import { AppError } from "../utils/AppError";

export class BracketController {
  async getBrackets(req: Request, res: Response, next: NextFunction) {
    console.info("[INFO]: Getting all brackets");
    try {
      const brackets = await bracketService.getBrackets();
      res.json({ message: "Getting brackets", payload: brackets });
    } catch (error) {
      next(error);
    }
  }

  async createBracket(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, tournamentID, type } = req.body;
      console.info(`[INFO]: Creating new bracket ${name}`);
      if (!name || !tournamentID || !type) {
        throw new AppError("Required fields are missing", 400);
      }

      const newTournament = await bracketService.createBracket({
        name,
        tournament_id: tournamentID,
        type,
      });
      res
        .status(201)
        .json({ message: "Creating bracket", payload: newTournament });
    } catch (error) {
      next(error);
    }
  }

  async deleteBracket(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      console.info(`[INFO]: Deleting bracket ${id}`);
      await bracketService.deleteBracket(id);
      res.json({ message: `Deleted bracket ${id}` });
    } catch (error) {
      next(error);
    }
  }

  async batchUpdateBracket(req: Request, res: Response, next: NextFunction) {
    try {
      const { changes } = req.body;
      console.info(`[INFO]: Making batch updates`);

      await bracketService.batchUpdateBracket(changes)
      res.json({ message: 'Changes were successful'})
    } catch (error) {
      next(error);
    }
  }
}

export const bracketController = new BracketController();
