const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM member WHERE mem_id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { mem_name, mem_phone, mem_email } = req.body;
  db.query('INSERT INTO member (mem_name, mem_phone, mem_email) VALUES (?, ?, ?)',
    [mem_name, mem_phone, mem_email],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, mem_name, mem_phone, mem_email });
    }
  );
});

router.put('/:id', (req, res) => {
  const { mem_name, mem_phone, mem_email } = req.body;
  db.query(
    'UPDATE member SET mem_name = ?, mem_phone = ?, mem_email = ? WHERE mem_id = ?',
    [mem_name, mem_phone, mem_email, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Member updated successfully' });
    }
  );
});

module.exports = router;

