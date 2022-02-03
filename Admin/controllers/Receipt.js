import PDFDocument from "pdfkit-table";
import Scholar from "../models/ScholarModel.js";
import { Sequelize } from "sequelize";
import fs from "fs";
import Tenant from "../models/TenantModel.js";

export async function Print(req, res) {
	try {
		if (req.body.tenant) {
			let doc = new PDFDocument({ margin: 30, size: "A4" });
			// to save on server
			const user = await Scholar.findAll({
				attributes: ["nama", "ingameslp"],
				include: {
					model: Tenant,
					where: {
						nama: req.body.tenant,
					},
					attributes: ["nama"],
				},
			});
			const total = await Scholar.findAll({
				attributes: [
					[Sequelize.fn("sum", Sequelize.col("ingameslp")), "akumulasi"],
				],
				include: {
					model: Tenant,
					where: {
						nama: req.body.tenant,
					},
					attributes: [],
				},
			});
			console.log(total[0].dataValues.akumulasi);
			const date = new Date().toDateString().replace(/ /g, "_");
			const tenant = user[0].tenant.nama;
			const namaFile = date + "_" + tenant;
			console.log(namaFile);
			doc.pipe(fs.createWriteStream(`./${namaFile}.pdf`));
			const table = {
				headers: [
					{ label: "Nama", property: "nama", width: 300, renderer: null },
					{
						label: "SLP",
						property: "ingameslp",
						width: 150,
						renderer: null,
					},
				],
				datas: user,
				rows: [["Total", total[0].dataValues.akumulasi]],
			};
			doc.table(table, {
				prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
				prepareRow: () => {
					doc.font("Helvetica").fontSize(8);
				},
			});
			doc.end();
			res.json({ msg: "hehe" }).status(200);
		} else {
			let doc = new PDFDocument({ margin: 30, size: "A4" });
			// to save on server
			const date = new Date().toDateString().replace(/ /g, "_");
			doc.pipe(fs.createWriteStream(`./${date}.pdf`));
			const user = await Scholar.findAll({
				attributes: ["nama", "ingameslp"],
			});
			const total = await Scholar.findAll({
				attributes: [
					[Sequelize.fn("sum", Sequelize.col("ingameslp")), "akumulasi"],
				],
			});

			const table = {
				headers: [
					{ label: "Nama", property: "nama", width: 300, renderer: null },
					{
						label: "SLP",
						property: "ingameslp",
						width: 150,
						renderer: null,
					},
				],
				datas: user,
				rows: [["Total", total[0].dataValues.akumulasi]],
			};
			doc.table(table, {
				prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
				prepareRow: () => {
					doc.font("Helvetica").fontSize(8);
				},
			});
			doc.end();
			res.json({ msg: "bner" }).status(200);
		}
	} catch (err) {
		// console.log(err);
		res.send(err).status(400);
	}
}

export const download = async (req, res) => {
	const directoryPath = "./";
	const fileName = req.body.filename;
	res.download(directoryPath + fileName, fileName, (err) => {
		if (err) {
			res.status(500).send({
				message: "Could not download the file. " + err,
			});
		}
	});
};
