import cors from "cors";
import { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";
const express = require("express");
const app = express();

import adminRouter from "./Routes/Admin.route";
import exerciseRouter from "./Routes/Exercise.route";
import onDemandRouter from "./Routes/OnDemand.route";
import userRouter from "./Routes/User.route";
import workoutRouter from "./Routes/Workout.route";

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  console.log("Hello world im here");
  return res.json({
    message: "Hey there everyone",
  });
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/exercise", exerciseRouter);
app.use("/workout", workoutRouter);
app.use("/onDemand", onDemandRouter);

export const grounds_cms_api = onRequest(app);
