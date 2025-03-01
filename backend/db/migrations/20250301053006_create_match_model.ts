import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE TYPE ippon_type AS ENUM (
          'Men',
          'Kote',
          'Do',
          'Tsuki',
          'Hantei',
          'Hansoku',
          'None'
        );
      `);

  return knex.schema.createTable("matches", (table) => {
    // Primary key
    table.increments("id").primary();

    // Foreign key to brackets table
    table.integer("bracket_id").unsigned().notNullable();
    table.foreign("bracket_id").references("brackets.id").onDelete("CASCADE");

    // Round and match number
    table.integer("round").notNullable();
    table.integer("match").notNullable();

    // Player references - store IDs only in the database
    // and handle the join to fetch full participant data
    table.integer("player1_id").unsigned().nullable();
    table
      .foreign("player1_id")
      .references("participants.id")
      .onDelete("SET NULL");

    table.integer("player2_id").unsigned().nullable();
    table
      .foreign("player2_id")
      .references("participants.id")
      .onDelete("SET NULL");

    // Winner reference
    table.integer("winner_id").unsigned().nullable();
    table
      .foreign("winner_id")
      .references("participants.id")
      .onDelete("SET NULL");

    // Scores - using JSONB arrays to store IpponType values
    // We'll validate the values in application code
    table.specificType("player1_score", "ippon_type[]").defaultTo("{}");
    table.specificType("player2_score", "ippon_type[]").defaultTo("{}");

    // Bye match flag
    table.boolean("bye_match").defaultTo(false);

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Unique constraint to ensure no duplicates within a bracket
    table.unique(["bracket_id", "round", "match"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the table
  await knex.schema.dropTableIfExists("matches");

  // Drop the custom enum type
  return knex.raw(`DROP TYPE IF EXISTS ippon_type;`);
}
