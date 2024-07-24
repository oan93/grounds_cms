const express = require("express");
const router = express.Router();

import {
  getExerciseData,
  updateExerciseData,
} from "../Controllers/Exercise.controller";

router.post("/update", updateExerciseData);
router.get("/", getExerciseData);

export default router;
