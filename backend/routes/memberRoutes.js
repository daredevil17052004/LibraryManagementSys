const express = require('express');
const router = express.Router();
const db = require('../utils/db.js');

// router.get('/:id', (req, res) => {
//   console.log(req.params)
//   console.log('sadghfkasghfjk ', req.params.id)
//   db.query('SELECT * FROM member WHERE mem_id = ?', [req.params.id], (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

router.get('/:id', async (req, res) => {
  try {
    console.log('Params received:', req.params);
    const [results] = await db.query('SELECT * FROM member WHERE mem_id = ?', [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { mem_name, mem_phone, mem_email } = req.body;
    const [result] = await db.query(
      'INSERT INTO member (mem_name, mem_phone, mem_email) VALUES (?, ?, ?)',
      [mem_name, mem_phone, mem_email]
    );

    res.json({ id: result.insertId, mem_name, mem_phone, mem_email });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// Update member by ID
router.put('/:id', async (req, res) => {
  try {
    const { mem_name, mem_phone, mem_email } = req.body;
    const [result] = await db.query(
      'UPDATE member SET mem_name = ?, mem_phone = ?, mem_email = ? WHERE mem_id = ?',
      [mem_name, mem_phone, mem_email, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ message: 'Member updated successfully' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

module.exports = router;

