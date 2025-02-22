const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Get a book by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM book WHERE book_id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new book
router.post('/', (req, res) => {
  const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
  db.query(
    'INSERT INTO book (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES (?, ?, ?, ?, ?)',
    [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher],
    (err, result) => {
      if (err) throw err;
      res.json({
        id: result.insertId,
        book_name,
        book_cat_id,
        book_collection_id,
        book_launch_date,
        book_publisher
      });
    }
  );
});

router.put('/:id', (req, res) => {
  const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
  db.query(
    'UPDATE book SET book_name = ?, book_cat_id = ?, book_collection_id = ?, book_launch_date = ?, book_publisher = ? WHERE book_id = ?',
    [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Book updated successfully' });
    }
  );
});

module.exports = router;
