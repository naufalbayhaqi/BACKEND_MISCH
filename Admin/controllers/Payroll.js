import SLP from "../models/SLPModel.js";
import Scholar from "../models/ScholarModel.js";
import { Sequelize } from "sequelize";
import Tenant from "../models/TenantModel.js";
import { db } from "../config/Database.js";
import { Op } from "sequelize";
import Payroll from "../models/PayrollModel.js";

export const addPayroll = async (req, res) => {
	try {
		var arr = [];
		var len = req.body.id.length;
		for (var i = 0; i < len; i++) {
			arr.push({
				userId: req.body.id[i],
				batch: req.body.nama,
			});
		}
		console.log(arr);
		await Payroll.bulkCreate(arr);
		res.status(200);
	} catch (err) {
		res.send(err).status(400);
	}
};

export const getPayroll = async (req, res) => {
	try {
		const payroll = await Payroll.findAll({
			where: { batch: req.body.nama },
			include: {
				model: Scholar,
				attributes: [],
			},
			attributes: {
				include: [
					[
						Sequelize.fn(
							"ROUND",
							Sequelize.literal("scholar.scholarpshare*slp/100"),
							2
						),
						"scholar",
					],

					[
						Sequelize.fn(
							"ROUND",
							Sequelize.literal("scholar.ownerpshare*slp/100"),
							2
						),
						"owner",
					],
				],
			},
			raw: true,
		});
		res.send(payroll).status(200);
	} catch (err) {
		res.send(err).status(400);
	}
};

export const editPayroll = async (req, res) => {
	try {
		// var arr = [];
		// var len = req.body.id.length;
		// for (var i = 0; i < len; i++) {
		// 	arr.push({
		// 		userId: req.body.id[i],
		// 		batch: req.body.slp[i],
		// 	});
		// }
		// console.log(arr);
	} catch (err) {}
};

export const deletePayroll = async (req, res) => {
	try {
	} catch (err) {}
};
