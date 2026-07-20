import pool from '../config/db.js';

export async function getDashboardStats(req, res, next) {
  try {
    const [orders] = await pool.query('SELECT total, status, created_at FROM orders');
    const [customerCount] = await pool.query("SELECT COUNT(*) AS cnt FROM users WHERE role = 'user'");
    const [lowStock] = await pool.query('SELECT id, name, stock FROM products WHERE stock < 10 AND is_active = 1');
    const [topProducts] = await pool.query(
      'SELECT product_name, SUM(quantity) AS total_qty FROM order_items GROUP BY product_name ORDER BY total_qty DESC LIMIT 5'
    );

    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    const totalSales = orders.reduce((s, o) => s + Number(o.total), 0);
    const newOrders = orders.filter(o => o.status === 'new').length;
    const todaySales = orders.filter(o => o.created_at.toISOString?.()?.startsWith?.(today) || String(o.created_at).startsWith(today)).reduce((s, o) => s + Number(o.total), 0);
    const monthSales = orders.filter(o => String(o.created_at) >= monthStart).reduce((s, o) => s + Number(o.total), 0);

    res.json({
      stats: {
        totalOrders: orders.length,
        newOrders,
        totalSales,
        totalCustomers: customerCount[0].cnt,
        todaySales,
        monthSales,
        lowStock,
        topProducts,
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllCustomers(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, whatsapp, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ customers: rows });
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20');
    res.json({ notifications: rows });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
}
