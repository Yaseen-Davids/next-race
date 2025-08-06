import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";
import cors from "cors";

import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import carRouter from "./routes/car";
import eventRouter from "./routes/event";

import { passport } from "./passport/index";

const app = express();

app.use(passport.initialize());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api", userRouter);
app.use("/api/cars", carRouter);
app.use("/api/events", eventRouter);

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

export const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log("Express server started on port: " + port);
});

export default app;
