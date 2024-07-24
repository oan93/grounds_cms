const express = require("express");
const router = express.Router();

import {
  getWorkoutData,
  updateWorkoutData,
} from "../Controllers/Workout.controller";

router.post("/update", updateWorkoutData);
router.get("/", getWorkoutData);
// router.post("updateWeekly", updateWeeklyData)

export default router;
