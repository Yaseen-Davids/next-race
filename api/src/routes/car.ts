import { Router, Request, Response, NextFunction } from "express";
import { repository } from "./base";
import { endpoint } from "./endpoint";
import { isAuthenticated } from "src/passport";
import { query } from "src/knex";

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

      if (car_id === "" || !car_id) throw "Car ID required";

      const data = await query.raw(
        `
        WITH raced_cars AS (
          SELECT DISTINCT r2.car_id
          FROM races r1
          JOIN races r2 ON r1.event_id = r2.event_id
          WHERE r1.car_id = :car_id
            AND r2.car_id != :car_id
        )

        SELECT c.id, c.name
        FROM cars c
        WHERE c.id != :car_id
          AND c.id NOT IN (SELECT car_id FROM raced_cars)
        order by c.name;
        `,
        { car_id }
      );

      return res.json(data.rows);
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
