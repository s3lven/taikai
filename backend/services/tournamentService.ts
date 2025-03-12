import { Tournament } from "../models/tournamentModel"
import { BracketDTO, TournamentDTO } from "../types"
import { AppError } from "../utils/AppError"
import supabase from "../utils/supabase"

export class TournamentService {
  async getTournaments(): Promise<
    (TournamentDTO & { brackets: Omit<BracketDTO, "tournamentID">[] })[]
  > {
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

    return tournaments
  }
  catch(error: any) {
    throw error instanceof AppError ? error : new AppError()
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
