import { Router } from "express";
import { repository } from "./base";
import { endpoint } from "./endpoint";
import { isAuthenticated } from "src/passport";

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

export default router;
