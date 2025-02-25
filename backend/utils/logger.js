// utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Custom format for console output
const consoleFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  // Format the timestamp
  const formattedTime = new Date(timestamp).toLocaleString();
  
  // Format metadata (excluding standard fields)
  let metaStr = '';
  if (Object.keys(meta).length > 0 && meta.service) {
    const { service, ...restMeta } = meta;
    if (Object.keys(restMeta).length > 0) {
      metaStr = ` ${JSON.stringify(restMeta)}`;
    }
  }
  
  return `[${formattedTime}] [${level.toUpperCase()}]: ${message}${metaStr}`;
});

// Custom timestamp format
const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss.SSS'
});

// Define log format for file output
const fileFormat = winston.format.combine(
  timestampFormat,
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'library-api' },
  transports: [
    // Write to all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat
    }),
    // Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      format: fileFormat
    }),
    // Console output for development with prettier formatting
    new winston.transports.Console({
      format: winston.format.combine(
        timestampFormat,
        winston.format.colorize(),
        consoleFormat
      )
    })
  ]
});

// Add context methods to logger
logger.startRequest = (req) => {
  return {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  };
};

// Create a Morgan-compatible stream object with better formatting
const morganFormat = (tokens, req, res) => {
  // Create a custom format for HTTP logs
  return JSON.stringify({
    'remote-address': tokens['remote-addr'](req, res),
    'time': tokens['date'](req, res, 'iso'),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'referrer': tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'response-time': tokens['response-time'](req, res, 3) + ' ms'
  });
};

// Create a Morgan-compatible stream object
const morganStream = {
  write: function(message) {
    // Use debug level for HTTP requests to keep them separate
    logger.http(message.trim());
  }
};

// Export logger and utilities
module.exports = logger;
module.exports.stream = morganStream;
module.exports.morganFormat = morganFormat;