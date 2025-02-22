const db = require('../config/db');

const getBooks = (callback) => {
  db.query('SELECT * FROM book', callback);
};

module.exports = { getBooks };

