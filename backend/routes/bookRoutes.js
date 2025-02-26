const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const logger = require("../utils/logger.js");

// Get a book by ID
router.get('/:id', async (req, res) => {
  const functionName = 'GET /book/:id';
  try {
    logger.info(`Fetching book with ID: ${req.params.id}`, { functionName });
    const [results] = await db.promisePool.query('SELECT * FROM book WHERE book_id = ?', [req.params.id]);

    if (results.length === 0) {
      logger.warn(`Book not found with ID: ${req.params.id}`, { functionName });
      return res.status(404).json({ error: 'Book not found' });
    }

    logger.info(`Successfully retrieved book with ID: ${req.params.id}`, { functionName });
    res.json(results[0]);
  } catch (err) {
    logger.error(`Database error when fetching book ID ${req.params.id}: ${err.message}`, { functionName, error: err });
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get all books
router.get('/', async (req, res) => {
  const functionName = 'GET /book';
  try {
    logger.info('Fetching all books', { functionName });
    const [results] = await db.promisePool.query('SELECT * FROM book');
    logger.info(`Successfully retrieved ${results.length} books`, { functionName });
    res.json(results);
  } catch (err) {
    logger.error(`Database error when fetching all books: ${err.message}`, { functionName, error: err });
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Add a new book
router.post('/', async (req, res) => {
  const functionName = 'POST /book';
  try {
    const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
    logger.info('Adding new book', { functionName, bookName: book_name });

    const [result] = await db.promisePool.query(
      'INSERT INTO book (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES (?, ?, ?, ?, ?)',
      [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher]
    );

    logger.info(`Book added successfully with ID: ${result.insertId}`, { functionName });
    res.json({
      id: result.insertId,
      book_name,
      book_cat_id,
      book_collection_id,
      book_launch_date,
      book_publisher
    });
  } catch (err) {
    logger.error(`Failed to add book: ${err.message}`, { functionName, error: err, bookData: req.body });
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Update book by ID
router.put('/:id', async (req, res) => {
  const functionName = 'PUT /book/:id';
  try {
    const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
    logger.info(`Updating book with ID: ${req.params.id}`, { functionName, bookName: book_name });

    const [result] = await db.promisePool.query(
      'UPDATE book SET book_name = ?, book_cat_id = ?, book_collection_id = ?, book_launch_date = ?, book_publisher = ? WHERE book_id = ?',
      [book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher, req.params.id]
    );

    if (result.affectedRows === 0) {
      logger.warn(`Attempted to update non-existent book with ID: ${req.params.id}`, { functionName });
      return res.status(404).json({ error: 'Book not found' });
    }

    logger.info(`Book with ID: ${req.params.id} updated successfully`, { functionName });
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    logger.error(`Failed to update book with ID ${req.params.id}: ${err.message}`, { functionName, error: err, bookId: req.params.id, bookData: req.body });
    res.status(500).json({ error: 'Failed to update book' });
  }
});

module.exports = router;
