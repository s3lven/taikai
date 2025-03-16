import { Tournament } from "../models/tournamentModel"
import { BracketDTO, TournamentDTO } from "../types"
import { AppError } from "../utils/AppError"
import supabase from "../utils/supabase"
import { Supabase } from "../types/express"
import pool from "../db"

export class TournamentService {
  async getTournaments(
    supabase: Supabase
  ): Promise<
    (TournamentDTO & { brackets: Omit<BracketDTO, "tournamentID">[] })[]
  > {
    try {
      const { data: tournaments, error } = await supabase
        .from("tournaments")
        .select(
          `
          id,
          name,
          status,
          location,
          date,
          brackets (
            id,
            name,
            status,
            type
          )
        `
        )
        .order("id", { ascending: false })

      if (error) throw new AppError(error.message)
      if (!tournaments) throw new AppError("No tournaments found", 404)

      console.log(tournaments)

      return tournaments
    } catch (error: any) {
      throw error instanceof AppError ? error : new AppError()
    }
  }

  async getUserTournaments(
    userId: string
  ): Promise<
    (TournamentDTO & { brackets: Omit<BracketDTO, "tournamentID">[] })[]
  > {
    try {
      // Supabase RPC -- b/c Supabase has limits but RPC is complicated imo
      // const { data: tournaments, error } = await supabase.rpc(
      //   "get_user_tournaments"
      // )

      // Knex.js equivalent if needed
      const tournaments = await pool("tournaments")
        .leftJoin(
          "tournament_editors",
          "tournaments.id",
          "tournament_editors.tournament_id"
        )
        .where("tournaments.creator_id", userId)
        .orWhere("tournament_editors.user_id", userId)
        .select("tournaments.*")
        .distinct()

      // if (error) throw new AppError(error.message)
      // If there are no tournaments (returns null) then return an empty array instead
      if (!tournaments) return []

      // The RPC call should return that type, however generating the types returns type JSON[]
      return tournaments as unknown as (TournamentDTO & {
        brackets: Omit<BracketDTO, "tournamentID">[]
      })[]
    } catch (error: any) {
      console.error(`[ERROR]: ${error}`)
      throw error instanceof AppError ? error : new AppError()
    }
  }

  async createTournament(data: Partial<Tournament>): Promise<TournamentDTO> {
    if (!data.name || !data.location || !data.date) {
      throw new AppError("Missing required fields", 400)
    }

    try {
      const { data: tournament, error } = await supabase
        .from("tournaments")
        .insert({ name: data.name, location: data.location, date: data.date })
        .select()
        .single()

      if (error) throw new AppError(error.message, 400)
      if (!tournament) throw new AppError("Failed to create tournament")

      return tournament
    } catch (error: any) {
      throw error instanceof AppError ? error : new AppError()
    }
  }

  async editTournament(id: number, data: Partial<Tournament>) {
    try {
      const { data: tournament, error } = await supabase
        .from("tournaments")
        .update(data)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error(error)
        if (error.code === "22008") {
          throw new AppError(`Date ${data.date} is invalid`, 400)
        }
        if (error.code === "PGRST116") {
          throw new AppError(`Tournament ${id} not found`, 404)
        }
        if (error.code === "22P02") {
          throw new AppError(`Status '${data.status}' is invalid`, 400)
        }
        throw new AppError(error.message, 400)
      }

      return tournament
    } catch (error: any) {
      throw error instanceof AppError ? error : new AppError()
    }
  }

  async deleteTournament(id: number): Promise<void> {
    try {
      const { error } = await supabase.from("tournaments").delete().eq("id", id)

      if (error) throw new AppError(error.message)
    } catch (error: any) {
      throw error instanceof AppError ? error : new AppError()
    }
  }
}

export const tournamentService = new TournamentService()
