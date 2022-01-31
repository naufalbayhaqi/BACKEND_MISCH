import { Sequelize } from "sequelize";
import { db } from "../config/Database.js";
import Tenant from "./TenantModel.js";
const { DataTypes } = Sequelize;

const Users = db.define(
	"users",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isUnique: (value, next) => {
					Users.findAll({
						where: { username: value },
						attributes: ["id"],
					})
						.then((user) => {
							if (user.length != 0) next(new Error("Username sudah ada!"));
							next();
						})
						.catch((onError) => console.log(onError));
				},
			},
		},
		password: {
			type: DataTypes.STRING,
		},
		refresh_token: {
			type: DataTypes.STRING,
		},
		tenantId: {
			type: DataTypes.INTEGER,
		},
		name: {
			type: DataTypes.STRING,
		},
		role: {
			type: DataTypes.INTEGER,
		},
	},
	{
		freezeTableName: true,
	}
);

Users.belongsTo(Tenant);
Tenant.hasMany(Users);

export default Users;
