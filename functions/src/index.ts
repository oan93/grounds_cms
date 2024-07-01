import cors from "cors";
import { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";
const express = require("express");
const app = express();

import userRouter from "./Routes/User.route";

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  console.log("Hello world im here");
  return res.json({
    message: "Hey there everyone",
  });
});

app.use("/user", userRouter);

export const grounds_cms_api = onRequest(app);
