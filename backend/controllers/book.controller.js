const Book = require('../models/book.model');

const getBookById = (req, res) => {
  const { id } = req.params;
  Book.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Book not found' });
    res.json(results[0]);
  });
};

const createBook = (req, res) => {
  Book.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

const updateBook = (req, res) => {
  const { id } = req.params;
  Book.update(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book updated successfully' });
  });
};

module.exports = { getBookById, createBook, updateBook };
