const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Get a book by ID
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM book WHERE book_id = ?', [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM book');
    res.json(results);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Add a new book
router.post('/', async (req, res) => {
  try {
    const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
    const [result] = await db.query(
      'INSERT INTO book (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES (?, ?, ?, ?, ?)',
      [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher]
    );

    res.json({
      id: result.insertId,
      book_name,
      book_cat_id,
      book_collection_id,
      book_launch_date,
      book_publisher
    });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Update book by ID
router.put('/:id', async (req, res) => {
  try {
    const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
    const [result] = await db.query(
      'UPDATE book SET book_name = ?, book_cat_id = ?, book_collection_id = ?, book_launch_date = ?, book_publisher = ? WHERE book_id = ?',
      [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

module.exports = router;
