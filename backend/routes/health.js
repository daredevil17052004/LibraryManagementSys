// Add this to your routes folder, e.g., /backend/routes/health.js

const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Service is running' });
});

module.exports = router;