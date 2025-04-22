import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("events", (table: Knex.TableBuilder) => {
    table.dropColumn("type");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("events", (table: Knex.TableBuilder) => {
    table.string("type").notNullable().defaultTo("video");
  });
}
