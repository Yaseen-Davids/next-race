import { Router, Request, Response, NextFunction } from "express";
import { repository } from "./base";
import { endpoint } from "./endpoint";
import { isAuthenticated } from "../passport";
import { query } from "../knex";

interface Car {
  id: string;
  name: string;
  class: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const router = Router();

router.use("/", isAuthenticated, endpoint<Car>(repository("cars")));

router.get(
  "/carsToRace/:id",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const car_id = req.params.id;

      if (car_id === "" || !car_id || car_id === "undefined")
        throw "Car ID required";

      const data = await query.raw(
        `
        WITH car_events AS (
          SELECT event_id
          FROM races
          WHERE car_id = :car_id
        )

        SELECT c.id, c.name, c.class, c.hp, c.nm, c.kg, 
               c."0_100", c."0_200", c."0_250", c."0_300", 
               c."0_350", c."0_400", c."0_500"
        FROM cars c
        WHERE c.id NOT IN (
          SELECT r.car_id
          FROM races r
          JOIN car_events ce ON r.event_id = ce.event_id
          WHERE r.car_id != :car_id
        )
        ORDER BY c.name;
        `,
        { car_id },
      );

      return res.json(data.rows);
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
