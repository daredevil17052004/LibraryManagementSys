const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid'); // For request IDs
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const issuanceRoutes = require('./routes/issuanceRoutes');
const libraryRoutes = require("./routes/libraryRoutes");
const authenticateAPIKey = require("./middleware/authMiddleware");
const bodyParser = require("body-parser");
const logger = require("./utils/logger");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Add request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// HTTP request logging with Morgan using our custom format
app.use(morgan(logger.morganFormat, { stream: logger.stream }));

// Request logging middleware
app.use((req, res, next) => {
  // Add contextual info to all subsequent log entries for this request
  req.logger = logger.child({ 
    requestId: req.id,
    method: req.method,
    path: req.path
  });
  
  // Log at the start of the request
  req.logger.debug('Request received');
  
  // Log when the response is finished
  res.on('finish', () => {
    req.logger.debug({
      statusCode: res.statusCode,
      responseTime: res.get('X-Response-Time'),
      message: 'Request completed'
    });
  });
  
  next();
});

// Response time middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds
    res.set('X-Response-Time', `${time.toFixed(2)}ms`);
  });
  
  next();
});

// Routes
app.use("/api/books", authenticateAPIKey, bookRoutes);
app.use("/api/members", authenticateAPIKey, memberRoutes);
app.use("/api/issuance", authenticateAPIKey, issuanceRoutes);
app.use("/api/library-stats", authenticateAPIKey, libraryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const logContext = {
    requestId: req.id || 'unknown',
    method: req.method || 'unknown',
    path: req.path || 'unknown',
    statusCode: err.status || 500,
    errorName: err.name,
    errorMessage: err.message
  };
  
  logger.error(logContext, 'Request error');
  
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    type: 'UnhandledRejection',
    reason: reason.toString(),
    stack: reason.stack || 'No stack trace available'
  }, 'Unhandled Promise Rejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error({
    type: 'UncaughtException',
    errorName: err.name,
    errorMessage: err.message,
    stack: err.stack
  }, 'Uncaught Exception');
  
  // Don't exit in development to allow nodemon to restart
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});