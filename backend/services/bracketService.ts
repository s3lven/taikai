import { Knex } from "knex";
import pool from "../db";
import { Bracket, BracketStatusType } from "../models/bracketModel";
import { Tournament } from "../models/tournamentModel";
import { BracketDTO } from "../types";
import { Change } from "../types/changes";
import { AppError } from "../utils/AppError";
import { Participant } from "../models/participantModel";
import { BracketParticipant } from "../models/bracketParticipantModel";

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
              await this.processParticipantChange(
                changeType,
                entityId,
                payload,
                trx
              );
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

  /* 
    "update": {name, sequence, bracketId}
    "create": {name, sequence, bracaketId}
    "delete": {participantId}
  */
  async processParticipantChange(
    changeType: string,
    participantId: number,
    payload: any,
    trx: Knex.Transaction<any, any[]>
  ) {
    switch (changeType) {
      case "update":
        if (payload.name) {
          await trx<Participant>("participants")
            .where({ id: participantId })
            .update(payload);
        }

        if (payload.sequence) {
          await trx<BracketParticipant>("bracket_participants")
            .where({
              participant_id: participantId,
              bracket_id: payload.bracketId,
            })
            .update(payload);
        }
        break;
      case "create":
        const newParticipant = await trx<Participant>("participants")
          .insert({ name: payload.name })
          .returning("*");
        console.log("New Participant:", newParticipant);

        if (!newParticipant)
          throw new AppError(`Failed to create participant ${payload.name}`);

        await trx<BracketParticipant>("bracket_participants").insert({
          participant_id: newParticipant[0].id,
          bracket_id: payload.bracketId,
          sequence: payload.sequence,
        });
        break;
      case "delete":
        const deleted = await trx<Participant>("participants")
          .where({ id: participantId })
          .del();
        if (!deleted)
          throw new AppError(`Participant ${participantId} not found`, 404);

      default:
        throw new AppError(
          `Unsupported change type for bracket: ${changeType}`
        );
    }
  }

  async runBracket(id: number, changes: Change[]) {
    try {
      // Get bracket to ensure it exists and check status
      const bracket = await pool<Bracket>("brackets").where({ id }).first();

      if (!bracket) {
        throw new AppError(`Bracket with ID ${id} not found`, 404);
      }

      if (bracket.status !== "Editing") {
        throw new AppError(
          "Cannot run bracket: bracket is not in editing mode",
          400
        );
      }

      await pool.transaction(async (trx) => {
        // Save any changes
        if (changes) await this.batchUpdateBracket(changes);

        // Update the status
        await this.updateBracketStatus(id, "In Progress", trx);

        // Construct matches and save in database
        // await createInitialMatches(id, trx);
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      else throw new AppError();
    }
  }

  async resetBracket(id: number) {
    try {
      // Get bracket to ensure it exists and check status
      const bracket = await pool<Bracket>("brackets").where({ id }).first();

      if (!bracket) {
        throw new AppError(`Bracket with ID ${id} not found`, 404);
      }

      if (bracket.status === "Editing") {
        throw new AppError(
          "Cannot reset bracket: bracket cannot be in editing mode",
          400
        );
      }

      // Change Status
      await pool.transaction(async (trx) => {
        // Update the status
        await this.updateBracketStatus(id, "Editing", trx);
        // Drop the matches
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      else throw new AppError();
    }
  }

  async openBracket(id: number) {}

  async completeBracket(id: number) {}

  /**
   * Update the status of a bracket
   * @param {number} id - The ID of the bracket to update
   * @param {BracketStatusType} status - The new status ('Editting', 'In Progress', 'Completed')
   * @param {Knex.Transaction} trx - The database transaction object (optional)
   * @returns {Promise} - Resolves when the update is complete
   */
  async updateBracketStatus(
    id: number,
    status: BracketStatusType,
    trx?: Knex.Transaction
  ): Promise<void> {
    const queryBuilder = trx
      ? trx<Bracket>("brackets")
      : pool<Bracket>("brackets");

    const result = await queryBuilder.where({ id }).update({ status });
    if (result === 0) throw new AppError(`Bracket with ID ${id} not found`);
  }

  async createInitialMatches(bracketId: number, trx: Knex.Transaction) {
    async function createSingleElimMatches() {
      for (let i = 0; i < firstRoundMatches; i++) {
        const seedPosition1 = i + 1;
        const seedPosition2 = totalSlots - i;

        const participant1 = participants[seedPosition1 - 1] || null;
        const participant2 = participants[seedPosition2 - 1] || null;

        const match = {
          bracket_id: bracketId,
        };
      }
    }

    // 1. Get bracket information including participants and bracket type
    const bracket = await trx<Bracket>("brackets")
      .where({ id: bracketId })
      .first();

    if (!bracket) {
      throw new Error(`Bracket with ID ${bracketId} not found`);
    }

    // 2. Get all participants in this bracket
    const participants = await trx("bracket_participants")
      .where({ bracket_id: bracketId })
      .orderBy("sequence", "asc");

    // 3. Determine bracket structure based on participant count
    const participantCount = participants.length;

    // Get the next power of 2 to determine total slots
    const totalSlots = Math.pow(2, Math.ceil(Math.log2(participantCount)));
    const firstRoundMatches = totalSlots / 2;
    const byes = totalSlots - participantCount;

    switch (bracket.type) {
      case "Single Elimination":
        await createSingleElimMatches();
        break;
      case "Double Elimination":
      case "Round Robin":
      case "Swiss":
        console.log("Creating matches");
        break;
      default:
        throw new AppError(`Unknown bracket status ${bracket.type}`);
    }
  }
}

export const bracketService = new BracketService();
