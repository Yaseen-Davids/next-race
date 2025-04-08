import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { local } from "./strategies/local";
import { facebookStrategy } from "./strategies/facebook";
import { googleStrategy } from "./strategies/google";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401);
  res.json({ message: "You are not authenticated" });
};

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

passport.use(local);
passport.use(facebookStrategy);
passport.use(googleStrategy);

export { passport };
