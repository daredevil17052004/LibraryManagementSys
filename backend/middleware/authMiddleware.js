const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  console.log("api auth")
  next();
};

module.exports = authenticateAPIKey;

