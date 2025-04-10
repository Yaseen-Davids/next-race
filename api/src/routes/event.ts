import { Router, Request, Response, NextFunction } from "express";
import { repository } from "./base";
import { endpoint } from "./endpoint";
import { isAuthenticated } from "src/passport";
import { query } from "src/knex";

const router = Router();

router.use("/", isAuthenticated, endpoint<Event>(repository("events")));

router.use(
  "/byUser",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO
      // const data = await query("").select("");
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  "/new-event",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: NewEvent = req.body;

      await query.transaction(async (trx) => {
        let { id: event_id, cars, ...rest } = body;

        if (event_id) {
          await trx("events").update(rest).where("id", event_id);
        } else {
          const result = await trx("events")
            .update(rest)
            .where("id", event_id)
            .returning("id");
          console.log("🚀 ~ transaction ~ result:", result);
          event_id = result[0];
        }

        for (let i = 0; i < cars.length; i++) {
          const car_id = cars[i];
          await trx("cars").insert({ car_id, event_id });
        }
      });
    } catch (error) {
      return next(error);
    }
  }
);

interface Event {
  id: string;
  date: Date;
  type: string;
  status: string;
  platform: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface NewEvent extends Event {
  cars: string[];
}

export default router;
