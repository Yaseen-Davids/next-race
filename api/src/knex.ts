import { Knex } from "knex";

export const query: Knex = require("knex")({
  client: "pg",
  connection: process.env.DB_CONN,
});
