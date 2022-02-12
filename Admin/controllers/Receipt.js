import PDFDocument from "pdfkit-table";
import Scholar from "../models/ScholarModel.js";
import { Sequelize } from "sequelize";
import fs from "fs";
import Tenant from "../models/TenantModel.js";
import Payroll from "../models/PayrollModel.js";
import Users from "../models/UserModel.js";

export async function Print(req, res) {
	try {
		var dir = `./receipt/`;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		} else {
			let doc = new PDFDocument({ margin: 30, size: "A4" });
			// to save on server
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
						Sequelize.fn(
							"ROUND",
							Sequelize.cast(
								Sequelize.literal("(100-fee)*(scholar.ownerpshare)*slp/10000"),
								"float"
							),
							2
						),
						"owner",
					],
					[
						Sequelize.fn(
							"ROUND",
							Sequelize.cast(
								Sequelize.literal("fee*scholar.ownerpshare*slp/10000"),
								"float"
							),
							2
						),
						"admin",
					],
				],
				raw: true,
			});
			const total = await Payroll.findOne({
				where: {
					batch: req.body.nama,
				},
				include: {
					model: Scholar,
					attributes: [],
				},
				attributes: [
					[
						Sequelize.fn(
							"ROUND",
							Sequelize.literal("SUM(scholar.scholarpshare*slp/100)"),
							2
						),
						"scholar",
					],
					[
						Sequelize.fn(
							"ROUND",
							Sequelize.literal(
								"SUM((100-fee)*(scholar.ownerpshare)*slp/10000)"
							),
							2
						),
						"owner",
					],
					[
						Sequelize.fn(
							"ROUND",
							Sequelize.literal("SUM(fee*scholar.ownerpshare*slp/10000)"),
							2
						),
						"admin",
					],
				],
				raw: true,
			});
			console.log(total);
			const namaFile = payroll[0].batch;
			doc.pipe(fs.createWriteStream(`./receipt` + `/${namaFile}.pdf`));
			const table = {
				headers: [
					{ label: "Nama", property: "nama", width: 150, renderer: null },
					{
						label: "Alias",
						property: "alias",
						width: 100,
						renderer: null,
					},
					{
						label: "Scholar's Cut",
						property: "scholar",
						width: 100,
						renderer: null,
					},
					{
						label: "Owner's Cut",
						property: "owner",
						width: 100,
						renderer: null,
					},
					{
						label: "Admin's Cut",
						property: "admin",
						width: 100,
						renderer: null,
					},
				],
				datas: payroll,
				rows: [["Total", "", total.scholar, total.owner, total.admin]],
			};
			doc.table(table, {
				prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
				prepareRow: () => {
					doc.font("Helvetica").fontSize(8);
				},
			});
			doc.end();
			res.json({ msg: "hehe" }).status(200);
		}
	} catch (err) {
		res.send(err).status(400);
	}
}

export const download = async (req, res) => {
	try {
		var directoryPath = "./receipt/";
		var fileName = req.body.filename + ".pdf";
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
		);
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
		res.header("Access-Control-Allow-Credentials", true);
		res.download(directoryPath + fileName, fileName, (err) => {
			if (err) {
				res.status(500).send({
					message: "Could not download the file. " + err,
				});
			}
		});
	} catch (err) {
		res.send(err).status(400);
	}
};
