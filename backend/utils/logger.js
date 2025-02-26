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
    format.printf(({ timestamp, level, message, service, ...metadata }) => {
      let functionName = '';
      if (metadata.function) {
        functionName = metadata.function;
        delete metadata.function;
      }
      
      const metaString = Object.keys(metadata).length 
        ? ` ${JSON.stringify(metadata)}` 
        : '';
        
      return `[${timestamp}] [${level.toUpperCase()}] [${functionName}] - ${message}${metaString}`;
    })
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, service, ...metadata }) => {
          let functionName = '';
          if (metadata.function) {
            functionName = metadata.function;
            delete metadata.function;
          }
          
          const metaString = Object.keys(metadata).length 
            ? ` ${JSON.stringify(metadata)}` 
            : '';
            
          return `[${timestamp}] [${level.toUpperCase()}] [${functionName}] - ${message}${metaString}`;
        })
      )
    }),
    // File transport
    new winston.transports.File({ 
      filename: logFile
    })
  ]
});

// Helper to extract the function name from caller
const getFunctionName = () => {
  const error = new Error();
  const stack = error.stack.split('\n');
  
  // The function that called the logger will be at index 3
  // Format: "    at FunctionName (file:line:column)"
  if (stack.length >= 4) {
    const callerLine = stack[3].trim();
    const match = callerLine.match(/at\s+([^\s(]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return 'unknown';
};

// Export wrapper functions that automatically detect caller function name
module.exports = {
  error: (message, meta = {}) => {
    meta.function = meta.function || getFunctionName();
    logger.error(message, meta);
  },
  warn: (message, meta = {}) => {
    meta.function = meta.function || getFunctionName();
    logger.warn(message, meta);
  },
  info: (message, meta = {}) => {
    meta.function = meta.function || getFunctionName();
    logger.info(message, meta);
  },
  debug: (message, meta = {}) => {
    meta.function = meta.function || getFunctionName();
    logger.debug(message, meta);
  },
  // Raw logger access if needed
  logger
};