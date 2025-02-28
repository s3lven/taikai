import { Knex } from "knex";
import pool from "../db";
import { Bracket } from "../models/bracketModel";
import { Tournament } from "../models/tournamentModel";
import { BracketDTO } from "../types";
import { Change } from "../types/changes";
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
      throw new AppError();
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
        throw new AppError();
      }
    }
  }

  async deleteBracket(id: number): Promise<void> {
    try {
      const deleted = await pool("brackets").where({ id }).del();
      if (!deleted) throw new AppError(`Bracket ${id} not found`, 404);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      else throw new AppError();
    }
  }

  async batchUpdateBracket(changes: Change[]) {
    try {
      const sortedChanges = changes.sort(
        (a: Change, b: Change) => a.timestamp - b.timestamp
      );

      await pool.transaction(async (trx) => {
        for (const change of sortedChanges) {
          const { entityType, entityId, changeType, payload } = change;

          switch (entityType) {
            case "bracket":
              await this.processBracketChange(
                changeType,
                entityId,
                payload,
                trx
              );
              break;
            case "participant":
              break;
            default:
              throw new AppError(`Unsupported entity type ${entityType}`);
          }
        }
      });
    } catch (error: any) {
      console.error(error);
      if (error instanceof AppError) throw error;
      else if (error.code === "23514")
        throw new AppError(`Tournament payload is not valid`, 400);
      throw new AppError();
    }
  }

  /* 
    Changes that can be made are name, type, and status.
    If the payload tries to change bracket id or tournament id, it will throw an error
  */
  async processBracketChange(
    changeType: string,
    bracketId: number,
    payload: any,
    trx: Knex.Transaction<any, any[]>
  ) {
    // Get bracket to ensure it exists and check status
    const bracket = await trx<Bracket>("brackets")
      .where({ id: bracketId })
      .first();

    if (!bracket) {
      throw new AppError(`Bracket with ID ${bracketId} not found`, 404);
    }

    if (bracket.status !== "Editing") {
      throw new AppError(
        "Cannot save changes: bracket is not in editing mode",
        400
      );
    }

    if ("id" in payload || "tournament_id" in payload) {
      throw new AppError("Cannot modify bracket or tournament IDs", 400);
    }

    switch (changeType) {
      case "update":
        await trx<Bracket>("brackets").where({ id: bracketId }).update(payload);
        break;
      default:
        throw new AppError(
          `Unsupported change type for bracket: ${changeType}`
        );
    }
  }
}

export const bracketService = new BracketService();
