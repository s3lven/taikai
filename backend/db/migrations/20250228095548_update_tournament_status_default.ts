import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("tournaments", (table) => {
    table.string("status").notNullable().defaultTo("Upcoming").alter(); // ✅ Only change the default
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("tournaments", (table) => {
    table.string("status").notNullable().alter(); // ❌ Remove default (rollback)
  });
}
