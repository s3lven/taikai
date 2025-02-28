import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // First, check if we need to modify the column type
  const hasColumn = await knex.schema.hasColumn("brackets", "type");

  if (hasColumn) {
    // Temporarily rename the column
    await knex.schema.alterTable("brackets", (table) => {
      table.renameColumn("type", "type_old");
    });

    // Add the new enum column
    await knex.schema.alterTable("brackets", (table) => {
      table
        .enu("type", [
          "Single Elimination",
          "Double Elimination",
          "Round Robin",
          "Swiss",
        ])
        .notNullable()
        .defaultTo("Single Elimination"); // provide a default value for existing rows
    });

    // Copy data from old column to new column
    await knex.raw(`
       UPDATE brackets
       SET type = type_old::text
     `);

    // Drop the old column
    await knex.schema.alterTable("brackets", (table) => {
      table.dropColumn("type_old");
      table.dropColumn("status")
    });
  }
  await knex.schema.alterTable("brackets", (table) => {
    table
      .enu("status", ["Editing", "In Progress", "Completed"])
      .notNullable()
      .defaultTo("Editing");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Convert back to string column
  await knex.schema.alterTable("brackets", (table) => {
    table.renameColumn("type", "type_temp");
  });

  await knex.schema.alterTable("brackets", (table) => {
    table.string("type", 50).notNullable();
  });

  // Copy data from enum column to string column
  await knex.raw(`
    UPDATE brackets
    SET type = type_temp::text
  `);

  await knex.schema.alterTable("brackets", (table) => {
    table.dropColumn("type_temp");
  });
  await knex.schema.alterTable("brackets", (table) => {
    table.enu("status", ["Editing", "In Progress", "Completed"]).notNullable();
  });
}
