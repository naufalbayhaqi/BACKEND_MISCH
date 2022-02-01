import PDFDocument from "pdfkit-table";
import Scholar from "../models/ScholarModel.js";
import { Sequelize } from "sequelize";
import fs from "fs";
import axios from "axios";
import path from "path";
import https from "https";

export async function Print(req, res) {
  try {
    let doc = new PDFDocument({ margin: 30, size: "A4" });
    // to save on server
    doc.pipe(fs.createWriteStream("./document.pdf"));
    const user = await Scholar.findAll({
      attributes: ["nama", "ingameslp"],
    });
    const total = await Scholar.findAll({
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("ingameslp")), "akumulasi"],
      ],
    });
    // -----------------------------------------------------------------------------------------------------
    // Complex Table with Object
    // -----------------------------------------------------------------------------------------------------
    // A4 595.28 x 841.89 (portrait) (about width sizes)
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

    // File URL
    const file = `./document.pdf`;
    res.download(file, "KONTOL"); // Set disposition and send it.
    // res.status(200);
  } catch (err) {
    console.log(err);
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
