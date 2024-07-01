const express = require("express");
const router = express.Router();

import {
  getUserFromFirestore,
  updateEmail,
  updatePassword,
  updateUserData,
} from "../Controllers/User.controller";

router.post("/updateEmail", updateEmail);
router.post("/updatePassword", updatePassword);
router.post("/update", updateUserData);
router.get("/", getUserFromFirestore);

export default router;
