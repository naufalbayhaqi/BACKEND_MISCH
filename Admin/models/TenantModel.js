import { Sequelize } from "sequelize";
import { db } from "../config/Database.js";

const { DataTypes } = Sequelize;

const Tenant = db.define(
  "tenant",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    low: {
      type: DataTypes.NUMBER,
    },
    med: {
      type: DataTypes.NUMBER,
    },
    high: {
      type: DataTypes.NUMBER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Tenant;
