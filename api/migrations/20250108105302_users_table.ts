import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"') // Ensure UUID extension is available
    .then(() => {
      return knex.schema.createTable("users", (table: Knex.TableBuilder) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("username").notNullable().unique();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.string("full_name");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
