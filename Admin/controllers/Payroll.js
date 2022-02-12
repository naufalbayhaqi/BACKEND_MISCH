import SLP from "../models/SLPModel.js";
import Scholar from "../models/ScholarModel.js";
import { Sequelize } from "sequelize";
import Tenant from "../models/TenantModel.js";
import { db } from "../config/Database.js";
import { Op } from "sequelize";
import Payroll from "../models/PayrollModel.js";

export const addPayroll = async (req, res) => {
	try {
		if (req.body.nama && req.body.id.length > 0) {
			var arr = [];
			var len = req.body.id.length;
			for (var i = 0; i < len; i++) {
				arr.push({
					scholarId: req.body.id[i],
					batch: req.body.nama,
					fee: req.body.fee,
				});
			}
			await Payroll.bulkCreate(arr);
			res.status(200).send("BENAR");
		} else {
			res.status(400).send("KONTOL");
		}
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
				include: {
					model: Tenant,
					attributes: [],
				},
			},
			attributes: [
				"*",
				[Sequelize.col("scholar.nama"), "nama"],
				[Sequelize.col("scholar.alias"), "alias"],
				[Sequelize.col("scholar.ingameslp"), "slp_total"],
				[Sequelize.col("scholar.tenant.nama"), "tenant"],
				[
					Sequelize.fn(
						"ROUND",
						Sequelize.cast(
							Sequelize.literal("scholar.scholarpshare*slp/100"),
							"float"
						),
						2
					),
					"scholar",
				],
				[
					Sequelize.cast(
						Sequelize.literal("(100-fee)*(scholar.ownerpshare)*slp/10000"),
						"int"
					),
					"owner",
				],
				[
					Sequelize.cast(
						Sequelize.literal("fee*scholar.ownerpshare*slp/10000"),
						"int"
					),
					"admin",
				],
			],
			raw: true,
		});
		res.send(payroll).status(200);
	} catch (err) {
		res.send(err).status(400);
	}
};

export const editPayroll = async (req, res) => {
	try {
		var arr = [];
		var len = req.body.data.length;
		for (var i = 0; i < len; i++) {
			arr.push({
				id: req.body.data[i].id,
				scholarId: req.body.data[i].scholarId,
				batch: req.body.data[i].batch,
				slp: req.body.data[i].slp,
				status: req.body.status,
			});
		}
		for (let i = 0; i < req.body.data.length; i++) {
			await Payroll.update(arr[i], {
				where: {
					id: req.body.data[i].id,
				},
			});
		}
		console.log(arr);
		res.send("MEMEK").status(200);
	} catch (err) {
		res.send(err).status(400);
		console.log(err);
	}
};

export const deletePayroll = async (req, res) => {
	try {
		await Payroll.destroy({
			where: {
				batch: req.body.nama,
			},
		});
		res.status(200).send("berhasil");
	} catch (err) {
		res.send(err).status(400);
	}
};

export const getBatch = async (req, res) => {
	try {
		const tol = await Payroll.findAll({
			attributes: ["batch", "status"],
			group: ["batch"],
		});
		res.send(tol).status(200);
	} catch (err) {
		res.send(err).status(400);
	}
};
