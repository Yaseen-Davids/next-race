import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").insert([
    {
      username: "yaseendavids",
      email: "yaseen.davids@vulcanlabs.com",
      password: "$2a$10$3uAbOgYuuHDYukD4qEgZ7.29d4aMfF8q0uTdW52F6UqTW0qBp7yRa",
      full_name: "Yaseen Davids",
    },
  ]);
}
