// Import express
import express from "express";
import cron from "node-cron";
// Import Controller Product
import {
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  isiData,
} from "../controllers/Users.js";

const router = express.Router();

router.get("/admin", getAdmin);
router.post("/admin", createAdmin);
router.put("/admin/", updateAdmin);
router.delete("/admin/", deleteAdmin);

//// Scholar

import {
  getScholar,
  createScholar,
  updateScholar,
  deleteScholar,
} from "../controllers/Users.js";

router.post("/scholar/list", getScholar);
// router.post("/scholar/tenant", getScholarByTenant);
router.post("/scholar", createScholar);
router.put("/scholar/", updateScholar);
router.delete("/scholar/", deleteScholar);
router.post("/refreshdata", isiData);
cron.schedule("0 7 * * *", isiData);

// SLP

import { isiDaily, getDaily, average } from "../controllers/SLP.js";
router.post("/daily", isiDaily);
cron.schedule("0 * * * *", isiDaily);
router.post("/daily/list", getDaily);

// Tenant
import {
  createTenant,
  deleteTenant,
  getTenants,
  updateTenant,
} from "../controllers/Tenant.js";
router.get("/tenant", getTenants);
router.post("/tenant", createTenant);
router.post("/average", average);
router.delete("/tenant", deleteTenant);
router.put("/tenant", updateTenant);

export default router;
