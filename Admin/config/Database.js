import {Sequelize} from "sequelize";

const db = new Sequelize('axie','root','',{
    host: "localhost",
    dialect: "mysql"
});

export default db;