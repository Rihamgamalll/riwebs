import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

export async function register(req, res, next) {
  try {
    const { full_name, email, password, phone, whatsapp } = req.body;

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, phone, whatsapp) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, phone || null, whatsapp || null]
    );

    const [users] = await pool.query('SELECT id, full_name, email, phone, whatsapp, role FROM users WHERE id = ?', [result.insertId]);
    const user = users[0];
    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    delete user.password;
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const [users] = await pool.query(
      'SELECT id, full_name, email, phone, whatsapp, role FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: users[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { full_name, phone, whatsapp } = req.body;
    await pool.query(
      'UPDATE users SET full_name = ?, phone = ?, whatsapp = ? WHERE id = ?',
      [full_name, phone || null, whatsapp || null, req.user.id]
    );
    const [users] = await pool.query('SELECT id, full_name, email, phone, whatsapp, role FROM users WHERE id = ?', [req.user.id]);
    res.json({ user: users[0] });
  } catch (err) {
    next(err);
  }
}
