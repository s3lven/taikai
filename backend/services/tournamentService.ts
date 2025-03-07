import pool from "../db";
import { Bracket } from "../models/bracketModel";
import { Tournament } from "../models/tournamentModel";
import { BracketDTO, TournamentDTO } from "../types";
import { AppError } from "../utils/AppError";

export class TournamentService {
  async getTournaments(): Promise<
    (TournamentDTO & { bracket: Omit<BracketDTO, "tournamentID">[] })[]
  > {
    try {
      // Grabs the tournament and bracket data such that bracket is an object in the tournament results
      const tournaments = await pool("tournaments")
        .select(
          "tournaments.id",
          "tournaments.name",
          "tournaments.status",
          "tournaments.location",
          "tournaments.date",
          pool.raw(`COALESCE(JSON_AGG(json_build_object(
          'id', brackets.id,
          'name', brackets.name,
          'status', brackets.status,
          'type', brackets.type
          ) ORDER BY brackets.id
          ) FILTER (WHERE brackets.id IS NOT NULL),
          '[]'
          ) AS brackets
          `)
        )
        .leftJoin("brackets", "tournaments.id", "brackets.tournament_id")
        .groupBy("tournaments.id");
      return tournaments;
    } catch (error: any) {
      throw new AppError();
    }
  }

  async getBracketsByTournamentID(id: number): Promise<BracketDTO[]> {
    try {
      // Check if tournament id exists
      const tournamentExists = await pool<Tournament>("tournaments")
        .select("*")
        .where("id", id)
        .first();

      if (!tournamentExists)
        throw new AppError(`Tournament ${id} does not exist`, 404);

      // Get the brackets
      const result = await pool<Bracket>("brackets")
        .where("tournament_id", id)
        .select("id", "tournament_id", "name", "type", "status")
        .orderBy("id", "desc");
      if (!result)
        throw new AppError(`There are no bracktes for tournament ${id}`, 404);

      // Format brackets
      const brackets: BracketDTO[] = result.map((bracket) => ({
        id: bracket.id,
        tournamentID: bracket.tournament_id,
        name: bracket.name,
        type: bracket.type,
        status: bracket.status,
      }));
      return brackets;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      else throw new AppError();
    }
  }

  async createTournament(data: Partial<Tournament>): Promise<TournamentDTO> {
    if (!data.name || !data.location || !data.date)
      throw new AppError("Missing required fields", 400);
    const result = await pool<Tournament>("tournaments")
      .insert(data)
      .returning(["id", "name", "location", "date", "status"]);
    const newTask: TournamentDTO = {
      id: result[0].id,
      name: result[0].name,
      location: result[0].location,
      date: result[0].date,
      status: result[0].status,
    };
    return newTask;
  }

  async editTournament(id: number, data: Partial<Tournament>) {
    try {
      const result = await pool<Tournament>("tournaments")
        .where("id", id)
        .update(data)
        .returning("*");
      if (!result) throw new AppError(`Tournament ${id} not found`, 404);
      const updatedTournament: TournamentDTO = {
        ...result[0],
      };
      return updatedTournament;
    } catch (error: any) {
      console.log(error, typeof error);
      if (error instanceof AppError) throw error;
      else if (error.code === "22008")
        throw new AppError(`Date ${data.date} is invalid`, 400);
      else if (error.code === "23514")
        throw new AppError(
          `Tournament status ${data.status} is not valid`,
          400
        );
      else throw new AppError("Internal sever error", 500);
    }
  }

  async deleteTournament(id: number): Promise<void> {
    try {
      const deleted = await pool("tournaments").where({ id }).del();
      if (!deleted) throw new AppError(`Tournament ${id} not found`, 404);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      else throw new AppError();
    }
  }
}

export const tournamentService = new TournamentService();
