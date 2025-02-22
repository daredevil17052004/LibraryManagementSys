const Issuance = require('../models/issuance.model');

const getIssuanceById = (req, res) => {
  const { id } = req.params;
  Issuance.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Issuance record not found' });
    res.json(results[0]);
  });
};

const createIssuance = (req, res) => {
  Issuance.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

const updateIssuance = (req, res) => {
  const { id } = req.params;
  Issuance.update(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Issuance record not found' });
    res.json({ message: 'Issuance record updated successfully' });
  });
};

module.exports = { getIssuanceById, createIssuance, updateIssuance };
