// const mysql = require("mysql2/promise");
const { Pool } = require('pg');
require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST || "",
//     user: process.env.DB_USER || "",
//     password: process.env.DB_PASS || "",
//     database: process.env.DB_DATABASE || "",
//     port: process.env.DB_PORT || "",
//     waitForConnections: true,
//     connectionLimit: 20,
//     queueLimit: 0,
//     dateStrings: true,
// });

const pool = new Pool({
    user: process.env.DB_USER || "",
    host: process.env.DB_HOST || "",
    database: process.env.DB_DATABASE || "",
    password: process.env.DB_PASS || "",
    port: process.env.DB_PORT || "",
    max: 20, // Número máximo de conexiones en el pool
    idleTimeoutMillis: 30000, // Tiempo máximo de inactividad antes de cerrar una conexión
    connectionTimeoutMillis: 2000, // Tiempo máximo para establecer una nueva conexión
});

pool.on('connect', () => {
    console.log('Connected to the database');
});
pool.on('error', (err) => {
    console.error('Error connecting to the database', err);
});

module.exports = {
    pool: pool
}