import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("events", (table: Knex.TableBuilder) => {
    table.string("comment").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("events", (table: Knex.TableBuilder) => {
    table.dropColumn("comment");
  });
}
