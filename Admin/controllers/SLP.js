import SLP from "../models/SLPModel.js";
import Scholar from "../models/ScholarModel.js";
import { Sequelize } from "sequelize";
import { db } from "../config/Database.js";

export const isiDaily = async (req, res) => {
  try {
    const users = await Scholar.findAll({
      attributes: [
        "tenant",
        [Sequelize.fn("sum", Sequelize.col("ingameslp")), "akumulasi"],
      ],
      group: ["tenant"],
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
            `COALESCE(akumulasi - (SELECT akumulasi FROM slp slp2 where slp2.date < slp.date AND slp2.tenant = slp.tenant order by slp2.date DESC limit 1 ),slp.akumulasi )`
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
          a.findIndex((t) => (t.date === v.date) & (t.tenant === v.tenant)) ===
          i
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
    res.status(400).send(err);
  }
};

export const getDaily = async (req, res) => {
  try {
    const slp = await SLP.findAll({
      attributes: [
        "date",
        [Sequelize.cast(Sequelize.col("daily"), "int"), "daily"],
        [Sequelize.cast(Sequelize.col("akumulasi"), "int"), "akumulasi"],
      ],
      where: {
        tenant: req.params.tenant,
      },
    });
    res.send(slp);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getAllDaily = async (req, res) => {
  try {
    const slp = await SLP.findAll({
      attributes: [
        "date",
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
    res.send(slp);
  } catch (err) {
    res.status(400).send(err);
  }
};
