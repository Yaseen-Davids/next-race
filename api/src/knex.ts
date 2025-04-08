export const query = require("knex")({
  client: "pg",
  connection: process.env.DB_CONN,
});
