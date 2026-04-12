const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { getPool } = require('../config/db');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const [existing] = await getPool().query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await getPool().query(
      'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, hashed]
    );

    res.status(201).json({ token: signToken(result.insertId), user: { id: result.insertId, name, email, phone: phone || null } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const [rows] = await getPool().query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const { password: _, reset_token: __, reset_token_expiry: ___, ...safeUser } = user;
    res.json({ token: signToken(user.id), user: safeUser });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const [rows] = await getPool().query(
      'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [rows] = await getPool().query('SELECT id FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(404).json({ message: 'No account with that email' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000;

    await getPool().query('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', [token, expiry, email]);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });

    res.json({ message: 'Reset email sent' });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const [rows] = await getPool().query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > ?',
      [token, Date.now()]
    );
    if (!rows.length) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashed = await bcrypt.hash(password, 10);
    await getPool().query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashed, rows[0].id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) { next(err); }
};
