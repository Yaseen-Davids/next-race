import FacebookStrat, { Profile } from "passport-facebook";

import { facebookConfig } from "../config";
import { query } from "src/knex";

export const facebookStrategy = new FacebookStrat.Strategy(
  facebookConfig,
  async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) => {
    const users = await query("users")
      .select("users.*")
      .where("email", profile._json.email);

    if (users.length == 0) {
      const new_user = await query("users")
        .insert({
          username: profile._json.email,
          email: profile._json.email,
          full_name: profile._json.email,
        })
        .returning("*");
      return done(null, new_user[0]);
    }

    if (users.length > 1) {
      throw new Error("Ambiguos user");
    }

    return done(null, users[0]);
  }
);
