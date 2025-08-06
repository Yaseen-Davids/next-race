import passport from "passport";
import { local } from "./strategies/local";
import { jwt } from "./strategies/jwt";

export const isAuthenticated = passport.authenticate("jwt", { session: false });

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

passport.use(local);
passport.use(jwt);

export { passport };
