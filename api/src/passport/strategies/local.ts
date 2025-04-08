import { query } from "../../knex";
import bcrypt from "bcryptjs";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;

export const local = new LocalStrategy(
  { usernameField: "username" },
  async (name, password, done) => {
    try {
      const users = await query("users")
        .select("users.*")
        .where("username", name);

      if (users.length > 1) {
        throw new Error("Ambiguos user");
      }

      const user = users[0];

      if (!user.password || user.password === "")
        throw new Error("Invalid Password");

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(undefined, user);
        } else {
          return done(undefined, false, { message: `Invalid password` });
        }
      });
    } catch (e) {
      return done(undefined, false, {
        message: `No account found for ${name}`,
      });
    }
  }
);
