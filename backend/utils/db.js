const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "library_user",
    password: process.env.DB_PASS || "library_pass",
    database: process.env.DB_NAME || "library_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.query("SELECT 1", (err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL database!");
    }
});

module.exports = pool.promise();
