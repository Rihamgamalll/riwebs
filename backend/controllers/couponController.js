import pool from '../config/db.js';

export async function getAllCoupons(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ coupons: rows });
  } catch (err) {
    next(err);
  }
}

export async function getActiveCoupons(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM coupons WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({ coupons: rows });
  } catch (err) {
    next(err);
  }
}

export async function validateCoupon(req, res, next) {
  try {
    const { code } = req.params;
    const [rows] = await pool.query('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [code.toUpperCase()]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired coupon' });
    }
    const coupon = rows[0];
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    res.json({ coupon });
  } catch (err) {
    next(err);
  }
}

export async function createCoupon(req, res, next) {
  try {
    const { code, description, discount_type, discount_value, min_order_amount, max_uses, is_active } = req.body;
    const [result] = await pool.query(
      'INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code.toUpperCase(), description || null, discount_type || 'percentage', Number(discount_value), Number(min_order_amount) || 0, max_uses ? Number(max_uses) : null, is_active === false ? 0 : 1]
    );
    const [rows] = await pool.query('SELECT * FROM coupons WHERE id = ?', [result.insertId]);
    res.status(201).json({ coupon: rows[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Coupon code already exists' });
    }
    next(err);
  }
}

export async function updateCoupon(req, res, next) {
  try {
    const { code, description, discount_type, discount_value, min_order_amount, max_uses, is_active } = req.body;
    const updates = [];
    const params = [];
    if (code) { updates.push('code = ?'); params.push(code.toUpperCase()); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (discount_type) { updates.push('discount_type = ?'); params.push(discount_type); }
    if (discount_value !== undefined) { updates.push('discount_value = ?'); params.push(Number(discount_value)); }
    if (min_order_amount !== undefined) { updates.push('min_order_amount = ?'); params.push(Number(min_order_amount)); }
    if (max_uses !== undefined) { updates.push('max_uses = ?'); params.push(max_uses ? Number(max_uses) : null); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active ? 1 : 0); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await pool.query(`UPDATE coupons SET ${updates.join(', ')} WHERE id = ?`, params);
    const [rows] = await pool.query('SELECT * FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ coupon: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteCoupon(req, res, next) {
  try {
    await pool.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
}
