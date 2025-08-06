import { Request, Response, Router, NextFunction } from "express";
import { port } from "../app";
import { isAuthenticated } from "../passport/index";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.render("index", { port });
  } catch (err) {
    return next(err);
  }
});

router.get(
  "/whoami",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
      return res.json(req.user).end();
    } else {
      return res.json({});
    }
  }
);

router.get("/status", (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: "Server is running" });
  } catch (err) {
    return next(err);
  }
});

export default router;
