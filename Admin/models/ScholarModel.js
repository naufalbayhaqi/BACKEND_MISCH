import { Sequelize } from "sequelize";
import { db } from "../config/Database.js";
import Tenant from "./TenantModel.js";

const { DataTypes } = Sequelize;

const Scholar = db.define(
	"scholar",
	{
		id: {
			type: DataTypes.STRING,
			autoIncrement: true,
			primaryKey: true,
		},
		nama: {
			type: DataTypes.STRING,
		},
		alias: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isUnique: (value, next) => {
					Scholar.findAll({
						where: { alias: value },
						attributes: ["id"],
					})
						.then((user) => {
							if (user.length != 0) next(new Error("Alias sudah ada!"));
							next();
						})
						.catch((onError) => console.log(onError));
				},
			},
		},
		tgllahir: {
			type: DataTypes.DATE,
		},
		gender: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
		},
		nowa: {
			type: DataTypes.STRING,
		},
		earningrating: {
			type: DataTypes.STRING,
		},
		addressronin: {
			type: DataTypes.STRING,
		},
		scholarpshare: {
			type: DataTypes.NUMBER,
		},
		ownerpshare: {
			type: DataTypes.NUMBER,
		},
		managerpshare: {
			type: DataTypes.NUMBER,
		},
		mmr: {
			type: DataTypes.NUMBER,
		},
		ingameslp: {
			type: DataTypes.NUMBER,
		},
		lastclaim: {
			type: DataTypes.DATE,
		},
		nextclaim: {
			type: DataTypes.DATE,
		},
		average: {
			type: DataTypes.NUMBER,
		},
		tenantId: {
			// foreign key tenant
			type: DataTypes.INTEGER,
			// required: true,
			// allowNull: false,
		},
	},
	{
		freezeTableName: true,
	}
);

Scholar.belongsTo(Tenant);
Tenant.hasMany(Scholar);

export default Scholar;
