// utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const { format } = winston;

// Ensure logs directory exists
const logDir = process.env.LOG_DIR || path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log file path
const logFile = process.env.LOG_FILE_PATH || path.join(logDir, 'library-app.log');

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, functionName }) => {
      return `[${timestamp}] [${level.toUpperCase()}] [${functionName || 'unknown'}] - ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, functionName }) => {
          return `[${timestamp}] [${level.toUpperCase()}] [${functionName || 'unknown'}] - ${message}`;
        })
      )
    }),
    new winston.transports.File({ 
      filename: logFile,
      maxsize: 5 * 1024 * 1024, // Rotate when log file reaches 5MB
      maxFiles: 5, // Keep last 5 log files
    })
  ]
});

// Helper to extract the function name from caller
const getFunctionName = () => {
  const error = new Error();
  const stack = error.stack.split('\n');
  if (stack.length >= 4) {
    const callerLine = stack[3].trim();
    const match = callerLine.match(/at\s+([^(\s]+|<anonymous>)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return 'unknown';
};

// Export wrapper functions that automatically detect caller function name
module.exports = {
  error: (message) => {
    logger.error(message, { functionName: getFunctionName() });
  },
  warn: (message) => {
    logger.warn(message, { functionName: getFunctionName() });
  },
  info: (message) => {
    logger.info(message, { functionName: getFunctionName() });
  },
  debug: (message) => {
    logger.debug(message, { functionName: getFunctionName() });
  },
  logger
};
