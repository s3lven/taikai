import pool from "../db";
import { Tournament } from "../models/tournamentModel";
import { TournamentDTO } from "../types";
import { AppError } from "../utils/AppError";

export class TournamentService {
  async getTournaments(): Promise<TournamentDTO[]> {
    try {
      const result = await pool<Tournament>("tournaments")
        .select(
          "id",
          "name",
          "location",
          "date",
          "status",
          "participant_count as participantCount"
        )
        .orderBy("id", "desc");
      return result;
    } catch (error: any) {
      throw new AppError("Internal server error", 500);
    }
  }

  async createTournament(data: Partial<Tournament>): Promise<TournamentDTO> {
    if (!data.name || !data.location || !data.date || !data.participant_count)
      throw new AppError("Missing required fields", 400);
    const result = await pool<Tournament>("tournaments")
      .insert(data)
      .returning([
        "id",
        "name",
        "location",
        "date",
        "status",
        "participant_count",
      ]);
    const newTask: TournamentDTO = {
      id: result[0].id,
      name: result[0].name,
      location: result[0].location,
      date: result[0].date,
      status: result[0].status,
      participantCount: result[0].participant_count,
    };
    return newTask;
  }

  async deleteTournament(id: number): Promise<void> {
    try {
      const deleted = await pool("tournaments").where({ id }).del();
      if (!deleted) throw new AppError(`Tournament ${id} not found`, 404);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      else throw new AppError("Internal server error", 500);
    }
  }
}

export const tournamentService = new TournamentService();
