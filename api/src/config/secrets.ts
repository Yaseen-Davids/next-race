import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

interface Secrets {
  postgres: {
    user: string;
    host: string;
    database: string;
    password: string;
    port: string;
    connection: string;
  };
  sessionSecret: string;
  jwtSecret: string;
  cryptoAPI: string;
}

export const secrets: Secrets = {
  postgres: {
    host: process.env.PGHOST!,
    user: process.env.PGUSER!,
    database: process.env.PGDATABASE!,
    password: process.env.PGPASSWORD!,
    port: process.env.PGPORT!,
    connection: process.env.DB_CONN!,
  },
  sessionSecret: process.env.SESSION_SECRET!,
  jwtSecret: process.env.JWT_SECRET!,
  cryptoAPI: process.env.CRYPTO_API!,
};
