import { Sequelize } from "sequelize";
import { db } from "../config/Database.js";
import Scholar from "./ScholarModel.js";

const { DataTypes } = Sequelize;

const Payroll = db.define(
	"payroll",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		scholarId: {
			type: DataTypes.INTEGER,
		},
		fee: {
			type: DataTypes.INTEGER,
		},
		batch: {
			type: DataTypes.STRING,
		},
		slp: {
			type: DataTypes.INTEGER,
		},
		status: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);

Payroll.belongsTo(Scholar);
Scholar.hasMany(Payroll);

export default Payroll;
