import { secrets } from "./src/config/secrets";

const config = {
  development: {
    client: "pg",
    connection: {
      host: secrets.postgres.host,
      user: secrets.postgres.user,
      database: secrets.postgres.database,
      password: secrets.postgres.password,
      port: secrets.postgres.port,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
