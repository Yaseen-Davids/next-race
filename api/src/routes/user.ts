import { Request, Response, Router, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { query } from "src/knex";
import { isAuthenticated } from "src/passport";
import multer from "multer";
import { Knex } from "knex";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/login", (req, res, next) => {
  passport.authenticate("local", function (err: any, user: any) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "You weren't authenticated!" });
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json(user).end();
    });
  })(req, res, next);
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await query("users")
      .insert({
        ...req.body,
        password: hashedPassword,
      })
      .returning("*");

    if (!user || user.length == 0) {
      throw "Error creating user";
    }

    req.login(user[0], (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Register successful!" });
    });
  } catch (error) {
    return next(error);
  }
});

router.get(
  "/logout",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    req.logout({ keepSessionInfo: false }, (err) => {
      if (err) return next(err);
      return res.json({ message: "Logged out!" });
    });
  }
);

router.get(
  "/user/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/user/login/google",
  passport.authenticate("google", { scope: ["email"] })
);

router.get(
  "/user/login/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: `${process.env.API_URL}`,
    failureRedirect: `${process.env.API_URL}/login`,
  })
);

router.get(
  "/user/login/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.API_URL}`,
    failureRedirect: `${process.env.API_URL}/login`,
  })
);

router.post(
  "/user/update",
  isAuthenticated,
  upload.single("profileImage"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await query.transaction(async (trx: Knex.Transaction) => {
        const data = req.body;
        const id = req.body.id;
        const file = (req as any).file;

        delete data["id"];

        if (data.password) {
          const hashedPassword = await bcrypt.hash(data.password, 10);
          data.password = hashedPassword;
        }

        await trx("users").update(data).where("id", id);

        if (file) {
          await trx("user_images").del().where("user_id", id);
          await trx("user_images").insert({
            user_id: id,
            filename: file.originalname,
            data: file.buffer,
            mime_type: file.mimetype,
          });
        }
      });

      return res.json();
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
