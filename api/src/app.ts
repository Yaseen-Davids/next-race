import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";
import cors from "cors";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import carRouter from "./routes/car";

import { passport } from "./passport/index";
import { secrets } from "./config/secrets";

const app = express();

const redisClient = createClient({
  url: secrets.redisUrl,
});

redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
});

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: secrets.sessionSecret,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api", userRouter);
app.use("/api/cars", carRouter);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static assets in production
// if (process.env.VERCEL_ENV === "production") {
//   app.use(express.static(path.resolve(__dirname, "../../ui/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../../ui/dist", "index.html"));
//   });
// }

const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

export const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log("Express server started on port: " + port);
});

export default app;
