import pool from '../config/db.js';

export async function getFavorites(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT f.id, f.created_at, p.*,
        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
       FROM favorites f JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ? AND p.is_active = 1 ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    const products = rows.map(p => ({
      ...p,
      skin_type: p.skin_type ? (typeof p.skin_type === 'string' ? JSON.parse(p.skin_type) : p.skin_type) : null,
      skin_concern: p.skin_concern ? (typeof p.skin_concern === 'string' ? JSON.parse(p.skin_concern) : p.skin_concern) : null,
      favorite_id: p.id,
      id: p.id,
    }));
    res.json({ favorites: products });
  } catch (err) {
    next(err);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'Product ID is required' });
    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)',
      [req.user.id, product_id]
    );
    res.status(201).json({ message: 'Added to favorites' });
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    await pool.query('DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]);
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    next(err);
  }
}

export async function checkFavorite(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    res.json({ is_favorite: rows.length > 0 });
  } catch (err) {
    next(err);
  }
}
