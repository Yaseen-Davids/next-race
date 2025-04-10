import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("events", (t: Knex.TableBuilder) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.timestamp("date").notNullable();
    t.string("type").notNullable().defaultTo("video");
    t.string("status").notNullable().defaultTo("new");
    t.string("platform").notNullable().defaultTo("youtube");
    t.uuid("user_id").notNullable();
    t.foreign("user_id").references("id").inTable("users").onDelete("cascade");
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("events");
}
