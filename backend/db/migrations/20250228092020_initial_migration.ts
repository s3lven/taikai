import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tournaments", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.enu("status", ["Active", "Upcoming", "Past"]).notNullable();
    table.string("location", 255);
    table.date("date").notNullable();
    table
      .integer("participant_count")
      .notNullable()
      .defaultTo(0)
      .checkPositive();
  });

  await knex.schema.createTable("brackets", (table) => {
    table.increments("id").primary();
    table
      .integer("tournament_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tournaments")
      .onDelete("CASCADE");
    table.string("name", 255).notNullable();
    table.enu("status", ["Editing", "In Progress", "Completed"]).notNullable();
    table
      .integer("participant_count")
      .notNullable()
      .defaultTo(0)
      .checkPositive();
    table.string("type", 50).notNullable();
    table.integer("progress").notNullable().defaultTo(0).checkBetween([0, 100]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("brackets");
  await knex.schema.dropTableIfExists("tournaments");
}
