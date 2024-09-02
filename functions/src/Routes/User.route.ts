const express = require("express");
const router = express.Router();

import {
  duplicateMealPlan,
  getUserByEmail,
  updateUserData,
} from "../Controllers/User.controller";

router.post("/update", updateUserData);
router.get("/", getUserByEmail);
router.post("/duplicateMeal", duplicateMealPlan);

export default router;
