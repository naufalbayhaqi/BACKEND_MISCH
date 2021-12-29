// Import express
import express from "express";
// Import Controller Product
import { 
    getAdmin,
    getAdminbyUsername,
    createAdmin,
    updateAdmin,
    deleteAdmin
 } from "../controllers/Users.js";
 
const router = express.Router();
 
router.get('/admin', getAdmin);
router.get('/admin/:username', getAdminbyUsername);
router.post('/admin', createAdmin);
router.put('/admin/:username', updateAdmin);
router.delete('/admin/:username', deleteAdmin);

//// Scholar

import { 
    getScholar,
    getScholarbyAlias,
    createScholar,
    updateScholar,
    deleteScholar
 } from "../controllers/Users.js";

router.get('/scholar', getScholar);
router.get('/scholar/:alias', getScholarbyAlias);
router.post('/scholar', createScholar);
router.put('/scholar/:alias', updateScholar);
router.delete('/scholar/:alias', deleteScholar);
export default router;