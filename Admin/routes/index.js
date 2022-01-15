// Import express
import express from "express";
import cron from "node-cron";
// Import Controller Product
import {
  getAdmin,
  getAdminbyUsername,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  isiData,
} from "../controllers/Users.js";

const router = express.Router();

router.get("/admin", getAdmin);
router.get("/admin/:username", getAdminbyUsername);
router.post("/admin", createAdmin);
router.put("/admin/:username", updateAdmin);
router.delete("/admin/:username", deleteAdmin);

//// Scholar

import {
  getScholar,
  getScholarbyAlias,
  createScholar,
  updateScholar,
  deleteScholar,
} from "../controllers/Users.js";

router.get("/scholar", getScholar);
router.get("/scholar/:id", getScholarbyAlias);
router.post("/scholar", createScholar);
router.put("/scholar/:id", updateScholar);
router.delete("/scholar/:id", deleteScholar);
router.post("/refreshdata", isiData);
cron.schedule("0 7 * * *", isiData);
export default router;
