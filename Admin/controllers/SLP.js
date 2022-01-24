import SLP from "../models/SLPModel.js";
import Scholar from "../models/ScholarModel.js";
import { Sequelize } from "sequelize";
import Tenant from "../models/TenantModel.js";
import { db } from "../config/Database.js";

export const isiDaily = async (req, res) => {
	try {
		const users = await Scholar.findAll({
			include: [{ model: Tenant, attributes: [], order: [["id", "asc"]] }],
			attributes: [
				[Sequelize.fn("sum", Sequelize.col("ingameslp")), "akumulasi"],
				[Sequelize.literal("tenant.id"), "tenantId"],
			],
			group: ["tenant.id"],
			raw: true,
		});
		const date = new Date().toJSON().slice(0, 10);
		users.map((o) => (o.date = date));
		await SLP.bulkCreate(users);
		const slp = await SLP.findAll({
			attributes: [
				"*",
				[
					Sequelize.literal(
						`COALESCE(akumulasi - (SELECT akumulasi FROM slp slp2 where slp2.date < slp.date AND slp2.tenantId = slp.tenantId order by slp2.date DESC limit 1 ),slp.akumulasi )`
					),
					"daily",
				],
			],
			order: ["date"],
			raw: true,
		});
		const data = slp
			.slice()
			.reverse()
			.filter(
				(v, i, a) =>
					a.findIndex(
						(t) => (t.date === v.date) & (t.tenantId === v.tenantId)
					) === i
			)
			.reverse();

		db.transaction(async function (t) {
			return SLP.destroy({
				truncate: true,
				cascade: false,
				transaction: t,
			}).then(function () {
				return SLP.bulkCreate(data, { transaction: t });
			});
		});

		res.json({
			message: "KONTOL",
		});
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};

export const getDaily = async (req, res) => {
	try {
		const slp = await SLP.findAll({
			include: [
				{
					model: Tenant,
					attributes: [],
					where: {
						nama: req.body.tenant,
					},
					order: [["id"], "asc"],
					include: [
						{
							model: Scholar,
							attributes: [],
						},
					],
				},
			],
			attributes: [
				"date",
				[
					Sequelize.cast(
						Sequelize.fn("sum", Sequelize.col("tenant.scholars.average")),
						"int"
					),
					"average",
				],
				[Sequelize.cast(Sequelize.col("daily"), "int"), "daily"],
				[Sequelize.cast(Sequelize.col("akumulasi"), "int"), "akumulasi"],
				// [Sequelize.literal("tenant.nama"), "tenant"],
			],
			raw: true,
		});
		var test = Object.keys(slp);
		for (var i = 0; i < test.length; i++) {
			slp[i].date = slp[i].date.slice(8, 10) + "/" + slp[i].date.slice(5, 7);
		}
		res.send(slp);
	} catch (err) {
		console.log(err);

		res.status(400).send(err);
	}
};

export const getAllDaily = async (req, res) => {
	try {
		const slp = await SLP.findAll({
			include: [
				{
					model: Tenant,
					attributes: [],
					include: [
						{
							model: Scholar,
							attributes: [],
						},
					],
				},
			],
			attributes: [
				"date",
				[
					Sequelize.cast(
						Sequelize.fn("sum", Sequelize.col("tenant.scholars.average")),
						"int"
					),
					"average",
				],
				[
					Sequelize.cast(Sequelize.fn("sum", Sequelize.col("daily")), "int"),
					"daily",
				],
				[
					Sequelize.cast(
						Sequelize.fn("sum", Sequelize.col("akumulasi")),
						"int"
					),
					"akumulasi",
				],
			],
			group: ["date"],
			raw: true,
		});
		var keys = Object.keys(slp);
		for (var i = 0; i < keys.length; i++) {
			slp[i].date = slp[i].date.slice(8, 10) + "/" + slp[i].date.slice(5, 7);
		}
		res.send(slp);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
};
