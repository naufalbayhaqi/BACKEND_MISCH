// Import express
import express from "express";
import cron from "node-cron";
// Import Controller Product

const router = express.Router();

//// Scholar

import {
	getScholar,
	createScholar,
	updateScholar,
	deleteScholar,
	isiData,
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
cron.schedule("* * * * *", isiDaily);
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

import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { download, Print } from "../controllers/Receipt.js";
import {
	createUser,
	deleteUser,
	getUsers,
	Login,
	Logout,
	updateUser,
	getProfile,
	forgotPassowrd,
	updateProfile,
} from "../controllers/Auth.js";
router.get("/users", verifyToken, getUsers);
router.post("/login", Login);
router.post("/profile", getProfile);
router.get("/token", refreshToken);
router.delete("/logout", Logout);
router.post("/doc", Print);
router.post("/register", createUser);
router.post("/print", download);
router.post("/admin", createUser);
router.put("/admin", updateUser);
router.put("/user", updateProfile);
router.delete("/admin", deleteUser);
router.put("/lupa", forgotPassowrd);

import {
	addPayroll,
	deletePayroll,
	editPayroll,
	finalize,
	getBatch,
	getPayroll,
} from "../controllers/Payroll.js";
router.post("/payroll", addPayroll);
router.post("/bebas", getPayroll);
router.get("/payroll", getBatch);
router.post("/editpayroll", editPayroll);
router.delete("/payroll", deletePayroll);
router.post("/finalize", finalize);

export default router;
