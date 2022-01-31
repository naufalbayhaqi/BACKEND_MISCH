import PDFDocument from "pdfkit";
import getStream from "get-stream";
import Scholar from "../models/ScholarModel.js";
import fs from "fs";
export async function Print(req, res) {
	try {
		const doc = new PDFDocument();
		doc.pipe(fs.createWriteStream("out.pdf"));
		doc
			.moveTo(300, 75)
			.lineTo(373, 301)
			.lineTo(181, 161)
			.lineTo(419, 161)
			.lineTo(227, 301)
			.fill("red", "even-odd");

		var loremIpsum =
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in...";

		doc.y = 320;
		doc.fillColor("black");
		doc.text(loremIpsum, {
			paragraphGap: 10,
			indent: 20,
			align: "justify",
			columns: 2,
		});

		doc.end("out.pdf");
		doc.pipe(res);
	} catch (err) {
		console.log(err);
		res.send(err);
	}
}
