import { Sequelize } from "sequelize";
import { db } from "../config/Database.js";

const { DataTypes } = Sequelize;

const SLP = db.define(
  "slp",
  {
    date: {
      type: DataTypes.DATE,
    },
    daily: {
      type: DataTypes.NUMBER,
    },
    akumulasi: {
      type: DataTypes.NUMBER,
    },
    tenant: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
SLP.removeAttribute("id");
export default SLP;
