import SLP from "../models/SLPModel.js";
import Scholar from "../models/ScholarModel.js";
import axios from "axios";
import { con } from "../config/Database.js";
import { Sequelize } from "sequelize";

export const getDaily = async (req, res) => {
  try {
    const users = await Scholar.findAll({
      attributes: [
        "tenant",
        [Sequelize.fn("sum", Sequelize.col("ingameslp")), "akumulasi"],
      ],
      group: ["tenant"],
      raw: true,
    });
    const slp = await SLP.findAll({
      raw: true,
    });
    await SLP.bulkCreate(users);
    res.json({
      message: "KONTOL",
    });
    console.log(slp);
  } catch (err) {
    res.status(400).send(err);
  }
};
