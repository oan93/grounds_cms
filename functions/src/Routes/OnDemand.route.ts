const express = require("express");
const router = express.Router();

import {
  getOnDemandData,
  updateExerciseData,
  updateOnDemandData,
} from "../Controllers/OnDemand.controller";

router.post("/update", updateOnDemandData);
router.get("/", getOnDemandData);
router.post("/updateExerciseData", updateExerciseData);

export default router;
