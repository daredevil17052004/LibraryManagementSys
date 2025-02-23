const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Get issuance by ID
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM issuance WHERE issuance_id = ?', [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Issuance record not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Add a new issuance record
router.post('/', async (req, res) => {
  try {
    const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = req.body;
    const [result] = await db.query(
      'INSERT INTO issuance (book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status) VALUES (?, ?, ?, ?, ?, ?)',
      [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status]
    );

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
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to add issuance record' });
  }
});

// Update issuance record by ID
router.put('/:id', async (req, res) => {
  try {
    const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = req.body;
    const [result] = await db.query(
      'UPDATE issuance SET book_id = ?, issuance_member = ?, issuance_date = ?, issued_by = ?, target_return_date = ?, issuance_status = ? WHERE issuance_id = ?',
      [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Issuance record not found' });
    }

    res.json({ message: 'Issuance record updated successfully' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to update issuance record' });
  }
});

module.exports = router;
