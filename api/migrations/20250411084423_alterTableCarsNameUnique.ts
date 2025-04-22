import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cars", (table: Knex.TableBuilder) => {
    table.unique(["name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cars", (table: Knex.TableBuilder) => {
    table.dropUnique(["name"]);
  });
}
