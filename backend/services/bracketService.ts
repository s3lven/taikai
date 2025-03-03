import { Knex } from "knex";
import pool from "../db";
import { Bracket, BracketStatusType } from "../models/bracketModel";
import { Tournament } from "../models/tournamentModel";
import {
  BracketDTO,
  ClientParticipant,
  MatchDTO,
  TournamentDTO,
} from "../types";
import { Change, ChangeType } from "../types/changes";
import { AppError } from "../utils/AppError";
import { Participant } from "../models/participantModel";
import { BracketParticipant } from "../models/bracketParticipantModel";
import { Match } from "../models/matchModel";

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

  async getBracketInfo(id: number) {
    try {
      // Get bracket details
      const bracket: BracketDTO = await pool<Bracket>("brackets")
        .where({ id })
        .select("id", "name", "status", "tournament_id as tournamentID", "type")
        .first();
      if (!bracket) throw new AppError(`Bracket ${id} was not found`, 404);

      // Get tournament detauls
      const tournament: TournamentDTO | undefined = await pool<Tournament>(
        "tournaments"
      )
        .where({ id: bracket.tournamentID })
        .first();
      if (!tournament)
        throw new AppError(
          `Tournament ${bracket.tournamentID} was not found`,
          404
        );

      // Get all participants in the bracket
      const participants: ClientParticipant[] = await pool<BracketParticipant>(
        "participants"
      )
        .select(["participants.*", "bracket_participants.sequence"])
        .join(
          "bracket_participants",
          "participants.id",
          "=",
          "bracket_participants.participant_id"
        )
        .where("bracket_participants.bracket_id", id)
        .orderBy("bracket_participants.sequence", "asc");

      // Get all matches
      const matches: Match[] = await pool<Match>("matches")
        .where("bracket_id", id)
        .orderBy([
          { column: "round", order: "asc" },
          { column: "match", order: "asc" },
        ]);

      // Create a map for easy participant lookup
      const participantsMap = new Map();
      participants.forEach((p) => {
        participantsMap.set(p.id, p);
      });

      // Transform matches to include full participant objects
      const matchesWithParticipants: MatchDTO[] = matches.map((match) => ({
        id: match.id,
        bracketID: match.bracket_id,
        player1: match.player1_id
          ? participantsMap.get(match.player1_id) || null
          : null,
        player2: match.player2_id
          ? participantsMap.get(match.player2_id) || null
          : null,
        player1Score: match.player1_score || [],
        player2Score: match.player2_score || [],
        winner: match.winner_id
          ? participantsMap.get(match.winner_id) || null
          : null,
        round: match.round,
        match: match.match,
        byeMatch: match.bye_match,
      }));

      const rounds = Math.log2(matchesWithParticipants.length + 1);
      const singleEliminationMatchStructure: MatchDTO[][] = Array.from(
        { length: rounds },
        () => []
      );

      matchesWithParticipants.forEach((match) => {
        singleEliminationMatchStructure[match.round].push(match);
      });

      return {
        tournament,
        bracket,
        participants,
        matches: singleEliminationMatchStructure,
      };
    } catch (error: any) {
      console.error(error);
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

      const bracketId = sortedChanges[0].entityId;

      await pool.transaction(async (trx) => {
        const bracketChanges = sortedChanges.filter(
          (c) => c.entityType === "bracket"
        );
        const participantChanges = sortedChanges.filter(
          (c) => c.entityType === "participant"
        );
        const matchChanges = sortedChanges.filter(
          (c) => c.entityType === "matches"
        );

        // Process bracket changes
        for (const change of bracketChanges) {
          await this.processBracketChanges(
            change.changeType,
            bracketId,
            change.payload,
            trx
          );
        }

        // Process participant changes with our new method
        if (participantChanges.length > 0) {
          await this.processParticipantChanges(
            bracketId,
            participantChanges,
            trx
          );
        }

        // Process match changes
        for (const change of matchChanges) {
          await this.processMatchChanges(
            change.changeType,
            bracketId,
            change.payload,
            trx
          );
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
  async processBracketChanges(
    changeType: ChangeType,
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
        "Cannot save changes: bracket is not in Editing mode",
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
          `Unsupported change type for bracket: ${changeType}`,
          404
        );
    }
  }

  async processParticipantChanges(
    bracketId: number,
    changes: Change[],
    trx: Knex.Transaction<any, any[]>
  ) {
    // Filter only participant changes and sort by timestamp
    const participantChanges = changes
      .filter((change) => change.entityType === "participant")
      .sort((a, b) => a.payload.sequence - b.payload.sequence);

    if (participantChanges.length === 0) return;

    // Get all existing participants for this bracket
    const existingParticipants = await trx("bracket_participants")
      .where({ bracket_id: bracketId })
      .join(
        "participants",
        "bracket_participants.participant_id",
        "participants.id"
      )
      .select(
        "participants.id",
        "participants.name",
        "bracket_participants.sequence"
      );

    // Create maps for quick lookups
    const participantIdMap = new Map();
    const sequenceMap = new Map();
    existingParticipants.forEach((p) => {
      participantIdMap.set(p.id, p);
      sequenceMap.set(p.sequence, p);
    });

    console.log("Participant ID Map", participantIdMap);
    console.log("Sequene Map", sequenceMap);

    // First process deletions to free up sequences
    const deletions = participantChanges.filter(
      (c) => c.changeType === "delete"
    );
    for (const deletion of deletions) {
      const participantId = deletion.payload.id;

      // Delete from bracket_participants first due to foreign key constraints
      await trx("bracket_participants")
        .where({
          bracket_id: bracketId,
          participant_id: participantId,
        })
        .del();

      // Then delete the participant if needed
      await trx("participants").where({ id: participantId }).del();

      // Update our maps
      if (participantIdMap.has(participantId)) {
        const participant = participantIdMap.get(participantId);
        sequenceMap.delete(participant.sequence);
        participantIdMap.delete(participantId);
      }
    }

    // Process creations next
    const creations = participantChanges.filter(
      (c) => c.changeType === "create"
    );
    for (const creation of creations) {
      const { name, sequence } = creation.payload;

      // Check if the sequence is already occupied
      if (sequenceMap.has(sequence)) {
        // We need to shift sequences up to make room
        const result = await trx<BracketParticipant>("bracket_participants")
          .where({ bracket_id: bracketId })
          .andWhere("sequence", ">=", sequence)
          .increment("sequence", 1)
          .returning("*");

        console.log("Result of shift:", result);
        
        // Update our maps after shifting sequences
        result.forEach(bp => {
          const participant = participantIdMap.get(bp.participant_id);
          if (participant) {
        // Remove old sequence mapping
        sequenceMap.delete(participant.sequence);
        // Update participant sequence
        participant.sequence = bp.sequence;
        // Add new sequence mapping
        sequenceMap.set(bp.sequence, participant);
          }
        });
      }

      // Create participant
      const [newParticipant] = await trx("participants")
        .insert({ name })
        .returning("*");
      console.log("Created participant", newParticipant);

      // Create bracket participant relationship
      await trx("bracket_participants").insert({
        bracket_id: bracketId,
        participant_id: newParticipant.id,
        sequence,
      });
      console.log(
        "Successfully added them to bracket_participants in sequence",
        sequence
      );

      // Update our maps
      participantIdMap.set(newParticipant.id, {
        id: newParticipant.id,
        name,
        sequence,
      });
      sequenceMap.set(sequence, {
        id: newParticipant.id,
        name,
        sequence,
      });
    }

    // Process name updates
    const nameUpdates = participantChanges.filter(
      (c) => c.changeType === "update" && c.payload.name && !c.payload.sequence
    );
    for (const update of nameUpdates) {
      const { id, name } = update.payload;

      // Check if participant exists
      if (!participantIdMap.has(id)) {
        throw new AppError(`Participant ${id} not found`, 404);
      }

      // Update name
      await trx("participants").where({ id }).update({ name });

      // Update our map
      const participant = participantIdMap.get(id);
      participant.name = name;
    }

    // Finally, process sequence updates
    // This is the most complex part due to potential conflicts
    const sequenceUpdates = participantChanges.filter(
      (c) => c.changeType === "update" && c.payload.sequence !== undefined
    );

    if (sequenceUpdates.length > 0) {
      // Create a plan for sequence moves to avoid conflicts
      await this.processSequenceUpdates(
        bracketId,
        sequenceUpdates,
        participantIdMap,
        sequenceMap,
        trx
      );
    }
  }

  // Helper function to process sequence updates
  async processSequenceUpdates(
    bracketId: number,
    updates: Change[],
    participantIdMap: Map<number, any>,
    sequenceMap: Map<number, any>,
    trx: Knex.Transaction
  ) {
    // Sort updates by sequence to handle moves in order
    updates.sort((a, b) => a.payload.sequence - b.payload.sequence);

    // We'll use temporary negative sequences to avoid conflicts
    let tempSequence = -1;

    // For each update, move the participant to a temporary sequence first
    for (const update of updates) {
      const { id, sequence, name } = update.payload;

      // Check if participant exists
      if (!participantIdMap.has(id)) {
        throw new AppError(`Participant ${id} not found`, 404);
      }

      const currentParticipant = participantIdMap.get(id);
      const currentSequence = currentParticipant.sequence;

      // Update name if provided
      if (name && name !== currentParticipant.name) {
        await trx("participants").where({ id }).update({ name });

        currentParticipant.name = name;
      }

      // Skip if sequence hasn't changed
      if (currentSequence === sequence) continue;

      // Move to temporary sequence to avoid conflicts
      await trx("bracket_participants")
        .where({
          bracket_id: bracketId,
          participant_id: id,
        })
        .update({ sequence: tempSequence });

      // Update maps
      sequenceMap.delete(currentSequence);
      sequenceMap.set(tempSequence, currentParticipant);
      currentParticipant.sequence = tempSequence;

      tempSequence--;
    }

    // Now move each to their final position
    for (const update of updates) {
      const { id, sequence } = update.payload;
      const participant = participantIdMap.get(id);

      // Skip if already at correct sequence (not needed but safe)
      if (participant.sequence === sequence) continue;

      // Move to final sequence
      await trx("bracket_participants")
        .where({
          bracket_id: bracketId,
          participant_id: id,
        })
        .update({ sequence });

      // Update maps
      sequenceMap.delete(participant.sequence);
      sequenceMap.set(sequence, participant);
      participant.sequence = sequence;
    }
  }

  // Users should only be allowed to update score, winner, and players
  async processMatchChanges(
    changeType: ChangeType,
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

    if (bracket.status !== "In Progress") {
      throw new AppError(
        "Cannot save changes: bracket is not In Progress",
        400
      );
    }

    switch (changeType) {
      case "update":
        await trx<Participant>("matches")
          .where({ id: payload.id })
          .update(payload);
        break;
      default:
        throw new AppError(
          `Unsupported change type for matches: ${changeType}`,
          404
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

      return await pool.transaction(async (trx) => {
        // Save any changes
        if (changes) await this.batchUpdateBracket(changes);

        // Update the status
        await this.updateBracketStatus(id, "In Progress", trx);

        // Construct matches
        const matches = await this.createInitialMatches(id, trx);
        console.log("Created matches:", matches);

        // Save matches in the database
        for (const match of matches) {
          const inserted = await trx<Match>("matches").insert(match);
          if (!inserted)
            throw new AppError(
              `Failed to insert new match: bracket ${match.bracket_id}-${match.round}-${match.match}`
            );
        }
      });
    } catch (error: any) {
      console.error(error);
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
        const deleted = await trx<Match>("matches")
          .where({ bracket_id: id })
          .del();
      });
    } catch (error: any) {
      console.error(error);
      if (error instanceof AppError) throw error;
      else throw new AppError();
    }
  }

  async openBracket(id: number) {
    try {
      // Get bracket to ensure it exists and check status
      const bracket = await pool<Bracket>("brackets").where({ id }).first();

      if (!bracket) {
        throw new AppError(`Bracket with ID ${id} not found`, 404);
      }

      if (bracket.status !== "Completed") {
        throw new AppError(
          "Cannot open bracket: bracket is not Completed",
          400
        );
      }

      // Change Status
      await pool.transaction(async (trx) => {
        // Update the status
        await this.updateBracketStatus(id, "In Progress", trx);
      });
    } catch (error: any) {
      console.error(error);
      if (error instanceof AppError) throw error;
      else throw new AppError();
    }
  }

  async completeBracket(id: number) {
    try {
      // Get bracket to ensure it exists and check status
      const bracket = await pool<Bracket>("brackets").where({ id }).first();

      if (!bracket) {
        throw new AppError(`Bracket with ID ${id} not found`, 404);
      }

      // Optional: Check if all the matches in the bracket have a winner
      if (bracket.status !== "In Progress") {
        throw new AppError(
          "Cannot complete bracket: bracket is not In Progress",
          400
        );
      }

      // Change Status
      await pool.transaction(async (trx) => {
        // Update the status
        await this.updateBracketStatus(id, "Completed", trx);
      });
    } catch (error: any) {
      console.error(error);
      if (error instanceof AppError) throw error;
      else throw new AppError();
    }
  }

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
    // Get bracket information including participants and bracket type
    const bracket = await trx<Bracket>("brackets")
      .where({ id: bracketId })
      .first();

    if (!bracket) {
      throw new AppError(`Bracket with ID ${bracketId} not found`);
    }

    const participants: ClientParticipant[] = await trx<Participant>(
      "participants"
    )
      .select("participants.*", "bracket_participants.sequence")
      .join(
        "bracket_participants",
        "participants.id",
        "=",
        "bracket_participants.participant_id"
      )
      .where("bracket_participants.bracket_id", bracketId)
      .orderBy("bracket_participants.sequence", "asc");

    console.log(participants);

    const participantCount = participants.length;
    const rounds = Math.ceil(Math.log2(participantCount));

    console.log(rounds);

    async function createSingleElimMatches() {
      const changeIntoBye = (seed: number) => {
        return seed <= participantCount
          ? participants.find((player) => player.sequence === seed)!
          : null;
      };

      // Single Elimination Algorithm
      const createMapping = () => {
        let matches: (ClientParticipant | null)[][] = [
          [
            participants.find((player) => player.sequence === 1)!,
            participants.find((player) => player.sequence === 2)!,
          ],
        ];
        for (let currRound = 1; currRound < rounds; currRound++) {
          const roundMatches = [];
          const sum = Math.pow(2, currRound + 1) + 1;
          for (const match of matches) {
            let player1 = changeIntoBye(match[0]!.sequence);
            let player2 = changeIntoBye(sum - match[0]!.sequence);
            roundMatches.push([player1, player2]);
            player1 = changeIntoBye(sum - match[1]!.sequence);
            player2 = changeIntoBye(match[1]!.sequence);
            roundMatches.push([player1, player2]);
          }
          matches = roundMatches;
        }

        // Match construction
        const bracket: Omit<Match, "id">[] = matches.map(
          (match, matchIndex) => ({
            bracket_id: bracketId,
            player1_id: match[0]?.id || null,
            player2_id: match[1]?.id || null,
            player1_score: [],
            player2_score: [],
            winner_id: null,
            round: 0,
            match: matchIndex,
            bye_match: false,
          })
        );
        return bracket;
      };

      const matches: Omit<Match, "id">[] = [];
      const initialMatches = createMapping();
      const initialMatchCount = initialMatches.length;

      // Create placeholder matches
      matches.push(...initialMatches);
      for (let round = 1; round < rounds; round++) {
        const roundMatchCount = initialMatchCount / Math.pow(2, round);
        for (let match = 0; match < roundMatchCount; match++) {
          matches.push({
            bracket_id: bracketId,
            player1_id: null,
            player2_id: null,
            player1_score: [],
            player2_score: [],
            winner_id: null,
            round,
            match,
            bye_match: false,
          });
        }
      }

      // Process bye rounds and advance players
      const firstRoundMatches = matches.filter((match) => match.round === 0);
      firstRoundMatches.forEach((match, matchIndex) => {
        const nextRoundMatch = matches.find(
          (m) => m.round === 1 && m.match === Math.floor(matchIndex / 2)
        );

        if (nextRoundMatch) {
          if (match.player1_id === null) {
            nextRoundMatch.player2_id = match.player2_id;
            match.bye_match = true;
          } else if (match.player2_id === null) {
            nextRoundMatch.player1_id = match.player1_id;
            match.bye_match = true;
          }
        }
      });

      return matches;
    }

    switch (bracket.type) {
      case "Single Elimination":
        return await createSingleElimMatches();
      case "Double Elimination":
        console.log("Creating Double Elimination Matches");
        return [];
      case "Round Robin":
        console.log("Creating Round Robin Matches");
        return [];
      case "Swiss":
        console.log("Creating Swiss Matches");
        return [];
      default:
        throw new AppError(`Unknown bracket status ${bracket.type}`);
    }
  }
}

export const bracketService = new BracketService();
