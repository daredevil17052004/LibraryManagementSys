const logger = require("../utils/logger"); // Import our logger

const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    logger.warn(`Unauthorized API access attempt: ${req.ip} - ${req.originalUrl}`);
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  
  logger.debug(`Authenticated API request from: ${req.ip} - ${req.originalUrl}`);
  next();
};

module.exports = authenticateAPIKey;