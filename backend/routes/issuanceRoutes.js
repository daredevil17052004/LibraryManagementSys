const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const logger = require('../utils/logger'); // Import our logger

// Get issuance by ID
router.get('/:id', async (req, res) => {
    const functionName = 'GET /issuance/:id';
    try {
        logger.info(`Fetching issuance with ID: ${req.params.id}`, { functionName });
        
        const [results] = await db.promisePool.query('SELECT * FROM issuance WHERE issuance_id = ?', [req.params.id]);
        
        if (results.length === 0) {
            logger.warn(`Issuance record not found with ID: ${req.params.id}`, { functionName });
            return res.status(404).json({ error: 'Issuance record not found' });
        }
        
        logger.debug(`Retrieved issuance data`, { functionName, data: results[0] });
        res.json(results[0]);
    } catch (err) {
        logger.error(`DB Error when fetching issuance with ID ${req.params.id}`, { functionName, error: err.message, stack: err.stack });
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Add a new issuance record
router.post('/', async (req, res) => {
    const functionName = 'POST /issuance';
    try {
        const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = req.body;
        logger.info(`Creating new issuance record for book ID: ${book_id} and member ID: ${issuance_member}`, { functionName });
        
        const [result] = await db.promisePool.query(
            'INSERT INTO issuance (book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status) VALUES (?, ?, ?, ?, ?, ?)',
            [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status]
        );
        
        logger.info(`Issuance record created with ID: ${result.insertId}`, { functionName });
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
        logger.error('DB Error when creating new issuance record', { functionName, error: err.message, stack: err.stack });
        res.status(500).json({ error: 'Failed to add issuance record' });
    }
});

// Update issuance record by ID
router.put('/:id', async (req, res) => {
    const functionName = 'PUT /issuance/:id';
    try {
        const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = req.body;
        logger.info(`Updating issuance record with ID: ${req.params.id}`, { functionName });
        
        const [result] = await db.promisePool.query(
            'UPDATE issuance SET book_id = ?, issuance_member = ?, issuance_date = ?, issued_by = ?, target_return_date = ?, issuance_status = ? WHERE issuance_id = ?',
            [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            logger.warn(`Failed to update - issuance record not found with ID: ${req.params.id}`, { functionName });
            return res.status(404).json({ error: 'Issuance record not found' });
        }
        
        logger.info(`Issuance record updated successfully with ID: ${req.params.id}`, { functionName });
        res.json({ message: 'Issuance record updated successfully' });
    } catch (err) {
        logger.error(`DB Error when updating issuance with ID ${req.params.id}`, { functionName, error: err.message, stack: err.stack });
        res.status(500).json({ error: 'Failed to update issuance record' });
    }
});

module.exports = router;
