import { NextFunction, Request, Response } from "express"
import { tournamentService } from "../services/tournamentService"
import { AppError } from "../utils/AppError"
import { Tournament } from "../models/tournamentModel"

export class TournamentController {
  async getTournaments(req: Request, res: Response, next: NextFunction) {
    console.info("[INFO]: Getting all tournaments")
    try {
      const tournaments = await tournamentService.getTournaments()
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
      console.info(
        `[INFO]: Getting all of the user ${req.user?.id} tournaments`
      )

      const tournaments = await tournamentService.getUserTournaments(user.id)
      res.json({ message: "Getting Tournaments", payload: tournaments })
    } catch (error) {
      next(error)
    }
  }

  async createTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, location, date } = req.body

      // Supabase is guaranteed to exist because of the middleware
      const supabase = req.supabase
      const creator_id = req.user?.id

      console.info(`[INFO]: Creating new tournament ${name}`)
      if (!name || !location || !date) {
        throw new AppError("Required fields are missing", 400)
      }
      if (!creator_id) throw new AppError("Authentication required", 401)

      const newTournament = await tournamentService.createTournament(
        {
          name,
          location,
          date,
          creator_id,
        },
        supabase
      )
      res
        .status(201)
        .json({ message: "Creating Tournaments", payload: newTournament })
    } catch (error) {
      next(error)
    }
  }

  async addTournamentEditor(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Authentication Required", 401)

      const { editorId } = req.body
      const supabase = req.supabase
      const tournamentId = parseInt(req.params.id)
      const userId = req.user.id

      if (!editorId) throw new AppError("Required fields are missing", 400)

      if (isNaN(tournamentId))
        throw new AppError(`Tournament Id ${req.params.id} is invalid`, 400)

      if (!userId) throw new AppError("There is no user Id")

      console.info(
        `[INFO]: Adding new editor ID ${editorId} to tournament ID ${tournamentId}`
      )

      await tournamentService.addTournamentEditor(
        userId,
        editorId,
        tournamentId,
        supabase
      )
      res.status(201).json({
        message: `Added new editor ID ${editorId} to tournament ID ${tournamentId}`,
        payload: null,
      })
    } catch (error) {
      next(error)
    }
  }

  async editTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const supabase = req.supabase
      const user = req.user

      if (!user) throw new AppError("Authentication Required", 401)

      const tournamentID = parseInt(req.params.id)
      if (isNaN(tournamentID)) {
        throw new AppError(`Invalid tournament ID ${tournamentID}`)
      }
      const { name, location, date, status } = req.body
      console.info(`[INFO]: Updating tournament ${tournamentID}`)

      if (!name || !location || !date || !status) {
        throw new AppError(`Required fields are missing`, 400)
      }

      const tournament: Partial<Tournament> = {
        name,
        location,
        date,
        status,
      }

      const updatedTournament = await tournamentService.editTournament(
        supabase,
        tournamentID,
        tournament
      )
      res.json({
        message: `Updated tournament ${tournamentID}`,
        payload: updatedTournament,
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteTournament(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const user = req.user
      const supabase = req.supabase
      console.info(`[INFO]: Deleting tourament ${id}`)
      if (!user) throw new AppError("Authentication Requred", 401)
      const deletedTournament = await tournamentService.deleteTournament(
        id,
        supabase
      )
      res.json({ message: `Deleted tournament ${deletedTournament.name}` })
    } catch (error) {
      next(error)
    }
  }
}

export const tournamentController = new TournamentController()
