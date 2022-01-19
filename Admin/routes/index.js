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
  getScholarByTenant,
  getTenants,
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
  createScholar,
  updateScholar,
  deleteScholar,
} from "../controllers/Users.js";

router.get("/scholar", getScholar);
router.get("/scholar/:tenant", getScholarByTenant);
router.post("/scholar", createScholar);
router.put("/scholar/:id", updateScholar);
router.delete("/scholar/:id", deleteScholar);
router.post("/refreshdata", isiData);
cron.schedule("0 7 * * *", isiData);
router.get("/tenant", getTenants);

// SLP

import { isiDaily, getDaily, getAllDaily } from "../controllers/SLP.js";
cron.schedule("5 7 * * *", isiDaily);
router.post("/isidaily", isiDaily);
router.get("/daily", getAllDaily);
router.get("/daily/:tenant", getDaily);
export default router;
