import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    await pool.query(
      'INSERT INTO notifications (type, title, body) VALUES (?, ?, ?)',
      ['contact', 'New Contact Message', `From: ${name} (${email})\nMessage: ${message}`]
    );
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
