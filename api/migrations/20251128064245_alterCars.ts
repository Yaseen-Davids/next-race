import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("cars", (table: Knex.TableBuilder) => {
    table.integer("hp").nullable();
    table.integer("nm").nullable();
    table.integer("kg").nullable();
    table.decimal("0_100", 5, 2).nullable();
    table.decimal("0_200", 5, 2).nullable();
    table.decimal("0_250", 5, 2).nullable();
    table.decimal("0_300", 5, 2).nullable();
    table.decimal("0_350", 5, 2).nullable();
    table.decimal("0_400", 5, 2).nullable();
    table.decimal("0_500", 5, 2).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("cars", (table: Knex.TableBuilder) => {
    table.dropColumn("hp");
    table.dropColumn("nm");
    table.dropColumn("kg");
    table.dropColumn("0_100");
    table.dropColumn("0_200");
    table.dropColumn("0_250");
    table.dropColumn("0_300");
    table.dropColumn("0_350");
    table.dropColumn("0_400");
    table.dropColumn("0_500");
  });
}
