import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Scholar = db.define('scholar',{
    addressronin: DataTypes.STRING
},{
    freezeTableName:true
});

export default Scholar;