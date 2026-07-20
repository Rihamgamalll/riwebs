import pool from '../config/db.js';

function parseArray(val) {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return null; }
}

function mapProduct(p) {
  if (!p) return p;
  return {
    ...p,
    skin_type: parseArray(p.skin_type),
    skin_concern: parseArray(p.skin_concern),
  };
}

export async function getAllProducts(req, res, next) {
  try {
    const { search, category, skin_type, product_type, concern, min_price, max_price, in_stock, sort, limit, offset } = req.query;
    let sql = `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
      (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1`;
    const params = [];

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (category) {
      sql += ` AND c.slug = ?`;
      params.push(category);
    }
    if (product_type) {
      sql += ` AND p.product_type = ?`;
      params.push(product_type);
    }
    if (min_price !== undefined) {
      sql += ` AND p.price >= ?`;
      params.push(Number(min_price));
    }
    if (max_price !== undefined) {
      sql += ` AND p.price <= ?`;
      params.push(Number(max_price));
    }
    if (in_stock === 'true') {
      sql += ` AND p.stock > 0`;
    }

    if (sort === 'price_low') sql += ` ORDER BY p.price ASC`;
    else if (sort === 'price_high') sql += ` ORDER BY p.price DESC`;
    else if (sort === 'rating') sql += ` ORDER BY p.rating DESC`;
    else sql += ` ORDER BY p.created_at DESC`;

    const lim = Number(limit) || 50;
    const off = Number(offset) || 0;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(lim, off);

    const [rows] = await pool.query(sql, params);

    let products = rows.map(mapProduct);

    if (skin_type) {
      products = products.filter(p => p.skin_type?.includes(skin_type));
    }
    if (concern) {
      products = products.filter(p => p.skin_concern?.includes(concern));
    }

    res.json({ products });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.is_active = 1`,
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product = mapProduct(rows[0]);

    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order, id',
      [product.id]
    );
    product.product_images = images;

    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function getSimilarProducts(req, res, next) {
  try {
    const [productRows] = await pool.query('SELECT category_id FROM products WHERE slug = ?', [req.params.slug]);
    if (productRows.length === 0) return res.json({ products: [] });
    const catId = productRows[0].category_id;

    const [rows] = await pool.query(
      `SELECT p.*,
        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
       FROM products p WHERE p.category_id = ? AND p.slug != ? AND p.is_active = 1 LIMIT 4`,
      [catId, req.params.slug]
    );
    res.json({ products: rows.map(mapProduct) });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, description, ingredients, how_to_use, price, discount_price, stock, brand, category_id, product_type, skin_type, skin_concern, is_best_seller, is_new_arrival, is_active, image_url } = req.body;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const [result] = await pool.query(
      `INSERT INTO products (name, slug, description, ingredients, how_to_use, price, discount_price, stock, brand, category_id, product_type, skin_type, skin_concern, is_best_seller, is_new_arrival, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, slug, description || null, ingredients || null, how_to_use || null,
        Number(price), discount_price ? Number(discount_price) : null, Number(stock) || 0,
        brand || null, category_id || null, product_type || null,
        skin_type ? JSON.stringify(skin_type) : null,
        skin_concern ? JSON.stringify(skin_concern) : null,
        is_best_seller === true || is_best_seller === 'true' ? 1 : 0,
        is_new_arrival === true || is_new_arrival === 'true' ? 1 : 0,
        is_active === false || is_active === 'false' ? 0 : 1,
      ]
    );

    const productId = result.insertId;

    if (image_url) {
      await pool.query(
        'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)',
        [productId, image_url]
      );
    }

    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    res.status(201).json({ product: mapProduct(products[0]) });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const fields = ['name', 'description', 'ingredients', 'how_to_use', 'price', 'discount_price', 'stock', 'brand', 'category_id', 'product_type', 'is_best_seller', 'is_new_arrival', 'is_active', 'image_url'];
    const updates = [];
    const params = [];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        if (field === 'image_url') continue;
        if (field === 'skin_type' || field === 'skin_concern') {
          if (req.body[field]) {
            updates.push(`${field} = ?`);
            params.push(JSON.stringify(req.body[field]));
          }
        } else if (field === 'is_best_seller' || field === 'is_new_arrival' || field === 'is_active') {
          updates.push(`${field} = ?`);
          params.push(req.body[field] === true || req.body[field] === 'true' ? 1 : 0);
        } else {
          updates.push(`${field} = ?`);
          params.push(req.body[field]);
        }
      }
    }

    if (req.body.skin_type !== undefined) {
      updates.push('skin_type = ?');
      params.push(req.body.skin_type ? JSON.stringify(req.body.skin_type) : null);
    }
    if (req.body.skin_concern !== undefined) {
      updates.push('skin_concern = ?');
      params.push(req.body.skin_concern ? JSON.stringify(req.body.skin_concern) : null);
    }

    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    if (req.body.image_url) {
      const [existingImg] = await pool.query('SELECT id FROM product_images WHERE product_id = ? LIMIT 1', [id]);
      if (existingImg.length > 0) {
        await pool.query('UPDATE product_images SET image_url = ? WHERE id = ?', [req.body.image_url, existingImg[0].id]);
      } else {
        await pool.query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)', [id, req.body.image_url]);
      }
    }

    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ product: mapProduct(products[0]) });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}

export async function getProductsBySection(req, res, next) {
  try {
    const { section } = req.params;
    let sql = '';
    const params = [];

    if (section === 'popular') {
      sql = `SELECT p.*, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
             FROM products p WHERE p.is_active = 1 ORDER BY p.rating DESC LIMIT 4`;
    } else if (section === 'new') {
      sql = `SELECT p.*, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
             FROM products p WHERE p.is_active = 1 AND p.is_new_arrival = 1 ORDER BY p.created_at DESC LIMIT 4`;
    } else if (section === 'bestseller') {
      sql = `SELECT p.*, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
             FROM products p WHERE p.is_active = 1 AND p.is_best_seller = 1 ORDER BY p.rating DESC LIMIT 4`;
    } else if (section === 'offers') {
      sql = `SELECT p.*, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS primary_image
             FROM products p WHERE p.is_active = 1 AND p.discount_price IS NOT NULL AND p.discount_price > 0 LIMIT 4`;
    } else {
      return res.status(400).json({ error: 'Invalid section' });
    }

    const [rows] = await pool.query(sql, params);
    res.json({ products: rows.map(mapProduct) });
  } catch (err) {
    next(err);
  }
}
