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
} from "../controllers/Users.js";

const router = express.Router();

router.get("/admin", getAdmin);
router.get("/admin/username", getAdminbyUsername);
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

router.get("/scholar", getScholar);
router.post("/scholar/tenant", getScholarByTenant);
router.post("/scholar", createScholar);
router.put("/scholar/", updateScholar);
router.delete("/scholar/", deleteScholar);
router.post("/refreshdata", isiData);
cron.schedule("0 7 * * *", isiData);

// SLP

import { isiDaily, getDaily, getAllDaily } from "../controllers/SLP.js";
router.post("/isidaily", isiDaily);
router.get("/daily", getAllDaily);
router.post("/daily/tenant", getDaily);

// Tenant
import {
  createTenant,
  deleteTenant,
  getTenants,
} from "../controllers/Tenant.js";
router.get("/tenant", getTenants);
router.post("/tenant", createTenant);
router.delete("/tenant", deleteTenant);
export default router;
