import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("tournaments", (table) => {
    table.dropColumn("participant_count");
  });

  await knex.schema.alterTable("brackets", (table) => {
    table.dropColumn("progress");
    table.dropColumn("participant_count");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("tournaments", (table) => {
    table
      .integer("participant_count")
      .notNullable()
      .defaultTo(0)
      .checkPositive();
  });

  await knex.schema.alterTable("brackets", (table) => {
    table.string("progress").notNullable();
    table
      .integer("participant_count")
      .notNullable()
      .defaultTo(0)
      .checkPositive();
  });
}
