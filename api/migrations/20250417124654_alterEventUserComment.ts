import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("events", (table: Knex.TableBuilder) => {
    table.boolean("user_comment").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("events", (table: Knex.TableBuilder) => {
    table.dropColumn("user_comment");
  });
}
