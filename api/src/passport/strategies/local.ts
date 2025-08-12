import { query } from "../../knex";

import passport from "passport";
import bcrypt from "bcryptjs";
import passportLocal from "passport-local";
import { sign } from "jsonwebtoken";
import { secrets } from "../../config/secrets";

const LocalStrategy = passportLocal.Strategy;

export const local = new LocalStrategy(
  { usernameField: "username", session: false },
  async (username, password, done) => {
    try {
      const user = await query("users").where("username", username).first();

      if (!user) {
        throw new Error("An error occurred");
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          const token = sign({ userId: user.id }, secrets.jwtSecret, {
            expiresIn: "7d",
          });
          return done(undefined, { ...user, token });
        } else {
          return done(undefined, false, { message: `Invalid password` });
        }
      });
    } catch (e) {
      return done(undefined, false, {
        message: `No account found for ${username}`,
      });
    }
  }
);

export { passport };
