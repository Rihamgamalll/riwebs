import pool from '../config/db.js';

export async function getReviews(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.full_name FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? ORDER BY r.created_at DESC`,
      [req.params.productId]
    );
    res.json({ reviews: rows });
  } catch (err) {
    next(err);
  }
}

export async function addReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const [existing] = await pool.query(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [req.user.id, productId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'You have already reviewed this product' });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [productId, req.user.id, rating, comment || null]
    );

    // Update product rating
    const [stats] = await pool.query(
      'SELECT AVG(rating) AS avg_rating, COUNT(*) AS count FROM reviews WHERE product_id = ?',
      [productId]
    );
    const avg = Math.round(stats[0].avg_rating * 10) / 10;
    const count = stats[0].count;
    await pool.query('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?', [avg, count, productId]);

    const [rows] = await pool.query(
      'SELECT r.*, u.full_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.id = ?',
      [result.insertId]
    );
    res.status(201).json({ review: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const [review] = await pool.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (review.length === 0) return res.status(404).json({ error: 'Review not found' });

    if (review[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);

    // Update product rating
    const [stats] = await pool.query(
      'SELECT AVG(rating) AS avg_rating, COUNT(*) AS count FROM reviews WHERE product_id = ?',
      [review[0].product_id]
    );
    const avg = stats[0].count > 0 ? Math.round(stats[0].avg_rating * 10) / 10 : 0;
    await pool.query('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?', [avg, stats[0].count, review[0].product_id]);

    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
}
