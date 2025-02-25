const db = require('../config/db');

const getBooks = (callback) => {
  db.promisePool.query('SELECT * FROM book', callback);
};

module.exports = { getBooks };

