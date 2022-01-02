import express from "express";

import {
    ambiladdress,
    getSLP
} from "../controllers/Axie.js";

const router = express.Router();

router.post('/addressroninbyalias', ambiladdress);
router.get('/axie/:addressronin', getSLP);
    
export default router;