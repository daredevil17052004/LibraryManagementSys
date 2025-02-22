const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  next();
};

module.exports = authenticateAPIKey;

