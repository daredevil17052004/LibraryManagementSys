const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const logger = require('../utils/logger'); // Import our logger

// Get issuance by ID
router.get('/:id', async (req, res) => {
  try {
    logger.info(`Fetching issuance with ID: ${req.params.id}`);
    
    const [results] = await db.promisePool.query('SELECT * FROM issuance WHERE issuance_id = ?', [req.params.id]);
    
    if (results.length === 0) {
      logger.warn(`Issuance record not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Issuance record not found' });
    }
    
    logger.debug(`Retrieved issuance data: ${JSON.stringify(results[0])}`);
    res.json(results[0]);
  } catch (err) {
    logger.error(`DB Error when fetching issuance with ID ${req.params.id}:`, err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Add a new issuance record
router.post('/', async (req, res) => {
  try {
    const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = req.body;
    logger.info(`Creating new issuance record for book ID: ${book_id} and member ID: ${issuance_member}`);
    
    const [result] = await db.promisePool.query(
      'INSERT INTO issuance (book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status) VALUES (?, ?, ?, ?, ?, ?)',
      [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status]
    );
    
    logger.info(`Issuance record created with ID: ${result.insertId}`);
    res.json({
      id: result.insertId,
      book_id,
      issuance_member,
      issuance_date,
      issued_by,
      target_return_date,
      issuance_status
    });
  } catch (err) {
    logger.error('DB Error when creating new issuance record:', err);
    res.status(500).json({ error: 'Failed to add issuance record' });
  }
});

// Update issuance record by ID
router.put('/:id', async (req, res) => {
  try {
    const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = req.body;
    logger.info(`Updating issuance record with ID: ${req.params.id}`);
    
    const [result] = await db.promisePool.query(
      'UPDATE issuance SET book_id = ?, issuance_member = ?, issuance_date = ?, issued_by = ?, target_return_date = ?, issuance_status = ? WHERE issuance_id = ?',
      [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      logger.warn(`Failed to update - issuance record not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Issuance record not found' });
    }
    
    logger.info(`Issuance record updated successfully with ID: ${req.params.id}`);
    res.json({ message: 'Issuance record updated successfully' });
  } catch (err) {
    logger.error(`DB Error when updating issuance with ID ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update issuance record' });
  }
});

module.exports = router;