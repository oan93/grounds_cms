const express = require("express");
const router = express.Router();

import {
  deleteUser,
  getUserByEmail,
  updateEmail,
  updatePassword,
} from "../Controllers/Admin.controller";

router.post("/updateEmail", updateEmail);
router.post("/updatePassword", updatePassword);
router.get("/", getUserByEmail);
router.post("/delete", deleteUser);

export default router;
