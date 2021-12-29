import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const FormScholar = db.define('formscholar' ,{
    email:{
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});

export default FormScholar;