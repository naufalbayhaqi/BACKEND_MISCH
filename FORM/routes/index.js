import express from "express";
import {
    formScholar,
    formOwner
} from "../controllers/FormControllers.js";

const router = express.Router();

router.post('/formScholar',formScholar);
router.post('/formOwner', formOwner);

export default router;