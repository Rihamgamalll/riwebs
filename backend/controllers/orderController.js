import pool from '../config/db.js';

export async function getOrders(req, res, next) {
  try {
    let sql, params;
    if (req.user.role === 'admin') {
      sql = `SELECT o.* FROM orders o ORDER BY o.created_at DESC`;
      params = [];
    } else {
      sql = `SELECT o.* FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC`;
      params = [req.user.id];
    }

    const [orders] = await pool.query(sql, params);

    // Get items for each order
    const ordersWithItems = [];
    for (const order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      ordersWithItems.push({ ...order, order_items: items });
    }

    res.json({ orders: ordersWithItems });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order = orders[0];

    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    order.order_items = items;
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function createOrder(req, res, next) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { full_name, phone, whatsapp, governorate, city, address_detail, landmark, notes, subtotal, discount, total, payment_method, coupon_code, items } = req.body;

    // Generate order number
    const [countResult] = await conn.query('SELECT COUNT(*) AS cnt FROM orders');
    const orderNumber = `RB-${String(1000 + countResult[0].cnt).padStart(4, '0')}`;

    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_number, user_id, full_name, phone, whatsapp, governorate, city, address_detail, landmark, notes, subtotal, discount, total, payment_method, coupon_code, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [orderNumber, req.user?.id || null, full_name, phone, whatsapp || null, governorate, city, address_detail, landmark || null, notes || null, Number(subtotal), Number(discount), Number(total), payment_method, coupon_code || null]
    );

    const orderId = orderResult.insertId;

    // Insert items and decrement stock
    for (const item of items) {
      const [productRows] = await conn.query('SELECT stock FROM products WHERE id = ? FOR UPDATE', [item.product_id]);
      if (productRows.length === 0) throw Object.assign(new Error('Product not found: ' + item.product_id), { status: 400 });
      if (productRows[0].stock < item.quantity) throw Object.assign(new Error('Insufficient stock for product: ' + item.product_name), { status: 400 });

      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);

      await conn.query(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.product_name, Number(item.price), item.quantity]
      );
    }

    // Increment coupon usage
    if (coupon_code) {
      await conn.query('UPDATE coupons SET used_count = used_count + 1 WHERE code = ?', [coupon_code]);
    }

    // Create notification
    await conn.query(
      'INSERT INTO notifications (type, title, body, order_id) VALUES (?, ?, ?, ?)',
      ['order', `New Order: ${orderNumber}`, `Order from ${full_name}`, orderId]
    );

    await conn.commit();

    // Build WhatsApp message
    const itemsList = items.map(i => `${i.product_name} × ${i.quantity}`).join('\n');
    const paymentLabels = { cod: 'Cash on Delivery', vodafone: 'Vodafone Cash', instapay: 'InstaPay' };
    const whatsappMessage = `New Order – Riham's Beauty\n\nOrder Number: ${orderNumber}\nCustomer Name: ${full_name}\nPhone: ${phone}\n${whatsapp ? `WhatsApp: ${whatsapp}\n` : ''}Address: ${governorate} – ${city}\n${address_detail}\nProducts:\n${itemsList}\nTotal: ${total} EGP\nPayment Method: ${paymentLabels[payment_method] || payment_method}${notes ? `\nNotes: ${notes}` : ''}`;

    res.status(201).json({
      order_id: orderId,
      order_number: orderNumber,
      status: 'success',
      whatsapp_message: whatsappMessage,
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json({ order: orders[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
}
