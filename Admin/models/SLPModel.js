import { Sequelize } from "sequelize";
import { db } from "../config/Database.js";
import Tenant from "./TenantModel.js";

const { DataTypes } = Sequelize;

const SLP = db.define(
  "slp",
  {
    date: {
      type: DataTypes.DATE,
    },
    daily: {
      type: DataTypes.INTEGER,
    },
    akumulasi: {
      type: DataTypes.INTEGER,
    },
    tenantId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

SLP.removeAttribute("id");

SLP.belongsTo(Tenant);
Tenant.hasMany(SLP);

export default SLP;
