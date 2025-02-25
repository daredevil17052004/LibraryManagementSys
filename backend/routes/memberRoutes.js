const express = require('express');
const router = express.Router();
const db = require('../utils/db.js');
const logger = require('../utils/logger'); // Import our logger

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    logger.info(`Fetching member with ID: ${req.params.id}`);
    
    const [results] = await db.promisePool.query('SELECT * FROM member WHERE mem_id = ?', [req.params.id]);
    
    if (results.length === 0) {
      logger.warn(`Member not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Member not found' });
    }
    
    logger.debug(`Retrieved member data: ${JSON.stringify(results[0])}`);
    res.json(results[0]);
  } catch (err) {
    logger.error(`DB Error when fetching member with ID ${req.params.id}:`, err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Create new member
router.post('/', async (req, res) => {
  try {
    const { mem_name, mem_phone, mem_email } = req.body;
    logger.info(`Creating new member: ${mem_name}`);
    
    const [result] = await db.promisePool.query(
      'INSERT INTO member (mem_name, mem_phone, mem_email) VALUES (?, ?, ?)',
      [mem_name, mem_phone, mem_email]
    );
    
    logger.info(`Member created with ID: ${result.insertId}`);
    res.json({ id: result.insertId, mem_name, mem_phone, mem_email });
  } catch (err) {
    logger.error('DB Error when creating new member:', err);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// Update member by ID
router.put('/:id', async (req, res) => {
  try {
    const { mem_name, mem_phone, mem_email } = req.body;
    logger.info(`Updating member with ID: ${req.params.id}`);
    
    const [result] = await db.promisePool.query(
      'UPDATE member SET mem_name = ?, mem_phone = ?, mem_email = ? WHERE mem_id = ?',
      [mem_name, mem_phone, mem_email, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      logger.warn(`Failed to update - member not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Member not found' });
    }
    
    logger.info(`Member updated successfully with ID: ${req.params.id}`);
    res.json({ message: 'Member updated successfully' });
  } catch (err) {
    logger.error(`DB Error when updating member with ID ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

module.exports = router;