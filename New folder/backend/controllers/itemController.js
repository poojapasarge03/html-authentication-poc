const { getPool } = require('../config/db');

exports.getStats = async (req, res, next) => {
  try {
    const [rows] = await getPool().query(
      `SELECT
        COUNT(*) AS total,
        SUM(status = 'active') AS active,
        SUM(status = 'pending') AS pending,
        SUM(status = 'completed') AS completed
       FROM items WHERE user_id = ?`,
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.getItems = async (req, res, next) => {
  try {
    const [rows] = await getPool().query(
      'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

exports.createItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const [result] = await getPool().query(
      'INSERT INTO items (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description || null, status || 'pending']
    );
    const [rows] = await getPool().query('SELECT * FROM items WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const [check] = await getPool().query('SELECT id FROM items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!check.length) return res.status(404).json({ message: 'Item not found' });

    await getPool().query(
      'UPDATE items SET title = ?, description = ?, status = ? WHERE id = ?',
      [title, description, status, req.params.id]
    );
    const [rows] = await getPool().query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { next(err); }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const [check] = await getPool().query('SELECT id FROM items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!check.length) return res.status(404).json({ message: 'Item not found' });

    await getPool().query('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) { next(err); }
};
