const express = require("express");
const dotenv = require("dotenv");
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
const healthRoutes = require("./routes/health");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
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
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' }) }));

// Request logging middleware
app.use((req, res, next) => {
  // Create a metadata object for the request context
  const requestMeta = {
    requestId: req.id,
    method: req.method,
    path: req.path
  };

  // Define logger methods that include the request context
  req.logger = {
    error: (message, meta = {}) => logger.error(message, { ...requestMeta, ...meta }),
    warn: (message, meta = {}) => logger.warn(message, { ...requestMeta, ...meta }),
    info: (message, meta = {}) => logger.info(message, { ...requestMeta, ...meta }),
    debug: (message, meta = {}) => logger.debug(message, { ...requestMeta, ...meta })
  };

  req.logger.debug("Request received");

  res.on('finish', () => {
    req.logger.debug("Request completed", {
      statusCode: res.statusCode,
      responseTime: res.get('X-Response-Time')
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
app.use("/api", healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Request error", {
    requestId: req.id || 'unknown',
    method: req.method || 'unknown',
    path: req.path || 'unknown',
    statusCode: err.status || 500,
    errorName: err.name,
    errorMessage: err.message
  });

  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error("Unhandled Promise Rejection", {
    type: 'UnhandledRejection',
    reason: reason.toString(),
    stack: reason.stack || 'No stack trace available'
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error("Uncaught Exception", {
    type: 'UncaughtException',
    errorName: err.name,
    errorMessage: err.message,
    stack: err.stack
  });

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);  
  }
});