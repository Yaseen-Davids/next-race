import { Router, Request, Response, NextFunction } from "express";
import { repository } from "./base";
import { endpoint } from "./endpoint";
import { isAuthenticated } from "src/passport";
import { query } from "src/knex";

interface Event {
  id: string;
  date: Date;
  status: string;
  platform: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface NewEvent extends Event {
  cars: string[];
}

const router = Router();

router.use("/", isAuthenticated, endpoint<Event>(repository("events")));

router.get(
  "/byIdWithCars/:id",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await query.raw(
        `
        SELECT
          e.*
          , JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                'value', c.id,
                'label', c.name
            )) AS cars
        FROM events e
        JOIN races r ON r.event_id = e.id
        JOIN cars c ON c.id = r.car_id
        WHERE e.id = :eventId
        GROUP BY e.id, e.date
        ORDER BY e.date ASC;
        `,
        { eventId: req.params.id }
      );
      return res.json(data.rows);
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/byUser",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { inputDate } = req.query;
      const data = await query.raw(
        `
        SELECT
            e.id AS event_id,
            e.status as event_status,
            to_char(e.date, 'YYYY-MM-DD') AS event_date,
            STRING_AGG(c.name, ' vs ' ORDER BY c.name) AS race_title
        FROM events e
        JOIN races r ON r.event_id = e.id
        JOIN cars c ON c.id = r.car_id
        WHERE e.date BETWEEN (?::timestamp - INTERVAL '1 month') AND (?::timestamp + INTERVAL '1 month')
        GROUP BY e.id, e.date, e.status
        ORDER BY e.date ASC;
        `,
        [inputDate, inputDate]
      );
      return res.json(data.rows);
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
          await trx("events")
            .update({ ...rest })
            .where("id", event_id);
        } else {
          const [event] = await trx("events")
            .insert({ ...rest })
            .returning("id");
          event_id = event.id;
        }

        await trx("races").del().where("event_id", event_id);

        for (let i = 0; i < cars.length; i++) {
          const car_id = cars[i];
          await trx("races").insert({ car_id, event_id });
        }
      });

      return res.json();
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
