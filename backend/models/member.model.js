const db = require('../utils/db');

const Member = {
  getById: (id, callback) => {
    db.promisePool.query('SELECT * FROM member WHERE mem_id = ?', [id], callback);
  },

  create: (memberData, callback) => {
    const { mem_name, mem_phone, mem_email } = memberData;
    db.promisePool.query(
      'INSERT INTO member (mem_name, mem_phone, mem_email) VALUES (?, ?, ?)',
      [mem_name, mem_phone, mem_email],
      callback
    );
  },

  update: (id, memberData, callback) => {
    const { mem_name, mem_phone, mem_email } = memberData;
    db.promisePool.query(
      'UPDATE member SET mem_name = ?, mem_phone = ?, mem_email = ? WHERE mem_id = ?',
      [mem_name, mem_phone, mem_email, id],
      callback
    );
  }
};

module.exports = Member;
