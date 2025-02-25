const mysql = require("mysql2");
require("dotenv").config();
const logger = require("./logger"); // Import our logger

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "library_user",
  password: process.env.DB_PASSWORD || "library_pass",
  database: process.env.DB_NAME || "library_db",
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    logger.error('Database connection failed:', err);
    return;
  }
  logger.info('Successfully connected to the Railway MySQL database');
  connection.release();
});

module.exports = {
  pool,
  promisePool
};