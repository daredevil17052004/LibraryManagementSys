const db = require('../utils/db');

const Issuance = {
  getById: (id, callback) => {
    db.promisePool.query('SELECT * FROM issuance WHERE issuance_id = ?', [id], callback);
  },

  create: (issuanceData, callback) => {
    const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = issuanceData;
    db.promisePool.query(
      'INSERT INTO issuance (book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status) VALUES (?, ?, ?, ?, ?, ?)',
      [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status],
      callback
    );
  },

  update: (id, issuanceData, callback) => {
    const { book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status } = issuanceData;
    db.promisePool.query(
      'UPDATE issuance SET book_id = ?, issuance_member = ?, issuance_date = ?, issued_by = ?, target_return_date = ?, issuance_status = ? WHERE issuance_id = ?',
      [book_id, issuance_member, issuance_date, issued_by, target_return_date, issuance_status, id],
      callback
    );
  }
};

module.exports = Issuance;
