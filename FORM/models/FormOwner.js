import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const FormOwner = db.define('formowner' ,{
    email:{
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});

export default FormOwner;