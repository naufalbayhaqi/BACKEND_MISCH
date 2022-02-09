import SLP from "../models/SLPModel.js";
import Scholar from "../models/ScholarModel.js";
import { Sequelize } from "sequelize";
import Tenant from "../models/TenantModel.js";
import { db } from "../config/Database.js";
import { Op } from "sequelize";

export const Kontol = async (req, res) => {
	(data = req.body.id), console.log(data);
};
