import mysql from "mysql2";

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "axie",
    multipleStatements: true
});

export default con;