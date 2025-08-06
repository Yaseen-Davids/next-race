import passportJwt from "passport-jwt";
import { secrets } from "../../config/secrets";
import { query } from "../../knex";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export const jwt = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secrets.jwtSecret,
  },
  async (jwtPayload, done) => {
    try {
      const user = await query("users").where("id", jwtPayload.userId).first();
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);
