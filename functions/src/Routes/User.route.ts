const express = require("express");
const router = express.Router();

import { getUserByEmail, updateUserData } from "../Controllers/User.controller";

router.post("/update", updateUserData);
router.get("/", getUserByEmail);

export default router;
