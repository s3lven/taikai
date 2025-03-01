import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("participants", (table) => {
    table.increments("id").primary(), table.string("name").notNullable();
  });

  await knex.schema.createTable("bracket_participants", (table) => {
    table.increments("id").primary();

    // Foreign Keys
    table
      .integer("bracket_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("brackets")
      .onDelete("CASCADE");
    table
      .integer("participant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("participants")
      .onDelete("CASCADE");

    // Additional attributes
    table.integer("sequence").unsigned().notNullable();

    // Composite unique key to prevent duplicates
    table.unique(["bracket_id", "participant_id"]);

    // Unique seed within each bracket (can't have two participants with the same seed)
    table.unique(["bracket_id", "sequence"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("bracket_participants");
  await knex.schema.dropTableIfExists("participants");
}
