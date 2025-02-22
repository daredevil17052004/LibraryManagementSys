const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get issuance by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM issuance WHERE issuance_id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new issuance record
router.post('/', (req, res) => {
  const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = req.body;
  db.query(
    'INSERT INTO issuance (book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status) VALUES (?, ?, ?, ?, ?, ?)',
    [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status],
    (err, result) => {
      if (err) throw err;
      res.json({
        id: result.insertId,
        book_id,
        issuance_member,
        issuance_date,
        issued_by,
        target_return_date,
        issuance_status
      });
    }
  );
});

router.put('/:id', (req, res) => {
    const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = req.body;
    db.query(
      'UPDATE issuance SET book_id = ?, issuance_member = ?, issuance_date = ?, issued_by = ?, target_return_date = ?, issuance_status = ? WHERE issuance_id = ?',
      [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status, req.params.id],
      (err, result) => {
        if (err) throw err;
        res.json({ message: 'Issuance record updated successfully' });
      }
    );
});

module.exports = router;
