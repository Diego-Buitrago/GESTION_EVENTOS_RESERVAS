const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_DATABASE || "",
    port: process.env.DB_PORT || "",
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    dateStrings: true,
});

module.exports = {
    pool: pool
}