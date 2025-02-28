import pool from "../db";
import { Bracket } from "../models/bracketModel";
import { Tournament } from "../models/tournamentModel";
import { BracketDTO } from "../types";
import { AppError } from "../utils/AppError";

export class BracketService {
  async getBrackets(): Promise<BracketDTO[]> {
    try {
      const result = await pool<Bracket>("brackets")
        .select("id", "tournament_id", "name", "type", "status")
        .orderBy("id", "desc");
      const brackets: BracketDTO[] = result.map((bracket) => ({
        id: bracket.id,
        tournamentID: bracket.tournament_id,
        name: bracket.name,
        type: bracket.type,
        status: bracket.status,
      }));
      return brackets;
    } catch (error: any) {
      throw new AppError("Internal server error", 500);
    }
  }

  async createBracket(data: Partial<Bracket>): Promise<BracketDTO> {
    try {
      if (!data.tournament_id || !data.name || !data.type)
        throw new AppError("Missing required fields", 400);

      const tournamentExists = await pool<Tournament>("tournaments")
        .select("*")
        .where("id", data.tournament_id)
        .first();

      if (!tournamentExists)
        throw new AppError(
          `Tournament ${data.tournament_id} does not exist`,
          404
        );

      const result = await pool<Bracket>("brackets")
        .insert(data)
        .returning(["id", "tournament_id", "name", "type", "status"]);

      const newBracket: BracketDTO = {
        id: result[0].id,
        tournamentID: result[0].tournament_id,
        name: result[0].name,
        type: result[0].type,
        status: result[0].status,
      };
      return newBracket;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      else if (error.code === "23514") {
        throw new AppError("Bracket already exists", 400);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async deleteBracket(id: number): Promise<void> {
    try {
      const deleted = await pool("brackets").where({ id }).del();
      if (!deleted) throw new AppError(`Bracket ${id} not found`, 404);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      else throw new AppError("Internal server error", 500);
    }
  }
}

export const bracketService = new BracketService();
