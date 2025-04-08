interface Secrets {
  sessionSecret: string;
  redisUrl: string;
  postgres: {
    user: string;
    host: string;
    database: string;
    password: string;
    port: string;
  };
}

export const secrets: Secrets = {
  sessionSecret: process.env.SESSION_SECRET!,
  redisUrl: process.env.REDIS_URL!,
  postgres: {
    host: process.env.PGHOST!,
    user: process.env.PGUSER!,
    database: process.env.PGDATABASE!,
    password: process.env.PGPASSWORD!,
    port: process.env.PGPORT!,
  },
};
