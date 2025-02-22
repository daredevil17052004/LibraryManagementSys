const Member = require('../models/member.model');

const getMemberById = (req, res) => {
  const { id } = req.params;
  Member.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Member not found' });
    res.json(results[0]);
  });
};

const createMember = (req, res) => {
  Member.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

const updateMember = (req, res) => {
  const { id } = req.params;
  Member.update(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member updated successfully' });
  });
};

module.exports = { getMemberById, createMember, updateMember };
