import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("races", (t: Knex.TableBuilder) => {
    t.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    t.uuid("event_id").notNullable();
    t.foreign("event_id")
      .references("id")
      .inTable("events")
      .onDelete("cascade");
    t.uuid("car_id").notNullable();
    t.foreign("car_id").references("id").inTable("cars").onDelete("cascade");
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("races");
}
