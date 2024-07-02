const express = require("express");
const router = express.Router();

import {
  getUserByEmail,
  updateEmail,
  updatePassword,
} from "../Controllers/Admin.Controller";

router.post("/updateEmail", updateEmail);
router.post("/updatePassword", updatePassword);
router.get("/", getUserByEmail);

export default router;
