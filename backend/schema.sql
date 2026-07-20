-- ============================================================
-- Riham's Beauty — Full E-commerce MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS rihams_beauty
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rihams_beauty;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 3. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  ingredients TEXT,
  how_to_use TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_price DECIMAL(10,2) NULL,
  stock INT NOT NULL DEFAULT 0,
  brand VARCHAR(255),
  category_id INT NULL,
  skin_type JSON,
  skin_concern JSON,
  product_type VARCHAR(100),
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  reviews_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_type ON products(product_type);

-- ============================================================
-- 4. PRODUCT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ============================================================
-- 5. REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ============================================================
-- 6. FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_fav (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- ============================================================
-- 7. ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(50),
  governorate VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address_detail TEXT NOT NULL,
  landmark VARCHAR(255),
  notes TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ============================================================
-- 8. ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(50),
  governorate VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address_detail TEXT NOT NULL,
  landmark VARCHAR(255),
  notes TEXT,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cod',
  coupon_code VARCHAR(100),
  status ENUM('new','confirmed','preparing','shipped','delivered','cancelled') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ============================================================
-- 9. ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- 10. COUPONS
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  discount_type ENUM('percentage','fixed') NOT NULL DEFAULT 'percentage',
  discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_uses INT NULL,
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from TIMESTAMP NULL,
  valid_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 11. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL DEFAULT 'order',
  title VARCHAR(255) NOT NULL,
  body TEXT,
  order_id INT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Admin user (password: admin123) — bcrypt hash
INSERT INTO users (full_name, email, password, phone, role) VALUES
('Riham Admin', 'admin@rihamsbeauty.com', '$2a$10$RkVmUHj5sT/K8X6iJzKyNeYy7KyYZGc3OKopZESMn5zA2WFR0/VOW', '01000000000', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Categories
INSERT INTO categories (name, slug, description) VALUES
('Cleanser', 'cleanser', 'Gentle cleansers for all skin types'),
('Serum', 'serum', 'Targeted treatments for specific skin concerns'),
('Moisturizer', 'moisturizer', 'Hydrating creams and lotions'),
('Sunscreen', 'sunscreen', 'UV protection for daily use'),
('Toner', 'toner', 'Balancing toners and essences'),
('Mask', 'mask', 'Treatment masks for deep care'),
('Eye Cream', 'eye-cream', 'Specialized care for the delicate eye area'),
('Exfoliator', 'exfoliator', 'Chemical and physical exfoliants')
ON DUPLICATE KEY UPDATE name=name;

-- Products
INSERT INTO products (name, slug, description, ingredients, how_to_use, price, discount_price, stock, brand, category_id, skin_type, skin_concern, product_type, is_best_seller, is_new_arrival, rating, reviews_count) VALUES
('Vitamin C Brightening Serum', 'vitamin-c-brightening-serum', 'A powerful vitamin C serum that brightens and evens skin tone while reducing dark spots and pigmentation.', 'Water, Ascorbic Acid (15%), Hyaluronic Acid, Glycerin, Niacinamide, Vitamin E, Ferulic Acid', 'Apply 3-4 drops to clean, dry skin in the morning. Follow with moisturizer and sunscreen.', 450.00, 380.00, 50, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='serum'), '["oily","combination","normal"]', '["pigmentation","dullness"]', 'serum', TRUE, FALSE, 4.8, 124),
('Hydrating Hyaluronic Moisturizer', 'hydrating-hyaluronic-moisturizer', 'Deeply hydrating moisturizer with hyaluronic acid that plumps and nourishes dry skin.', 'Water, Hyaluronic Acid, Glycerin, Ceramides, Shea Butter, Niacinamide, Panthenol', 'Apply to clean skin morning and evening. Massage gently until absorbed.', 320.00, NULL, 80, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='moisturizer'), '["dry","sensitive","normal"]', '["dryness","sensitivity"]', 'moisturizer', TRUE, TRUE, 4.9, 89),
('Gentle Foaming Cleanser', 'gentle-foaming-cleanser', 'A gentle daily cleanser that removes impurities without stripping the skin barrier.', 'Water, Cocamidopropyl Betaine, Glycerin, Aloe Vera Extract, Chamomile, Green Tea Extract', 'Massage onto damp skin morning and evening. Rinse thoroughly with lukewarm water.', 180.00, 150.00, 120, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='cleanser'), '["oily","dry","combination","sensitive","normal"]', '["acne","sensitivity"]', 'cleanser', TRUE, FALSE, 4.7, 203),
('Mineral Sunscreen SPF 50', 'mineral-sunscreen-spf-50', 'Broad-spectrum mineral sunscreen with SPF 50 that protects against UVA and UVB rays.', 'Zinc Oxide (20%), Titanium Dioxide, Water, Glycerin, Niacinamide, Green Tea Extract', 'Apply generously as the last step in your morning routine. Reapply every 2 hours.', 280.00, NULL, 65, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='sunscreen'), '["oily","dry","combination","sensitive","normal"]', '["pigmentation","sensitivity"]', 'sunscreen', TRUE, TRUE, 4.6, 156),
('Soothing Rose Toner', 'soothing-rose-toner', 'An alcohol-free toner with rose water that balances and refreshes the skin.', 'Rose Water, Water, Glycerin, Aloe Vera, Allantoin, Panthenol', 'After cleansing, apply with a cotton pad or pat gently with hands. Use morning and evening.', 160.00, 130.00, 90, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='toner'), '["dry","sensitive","normal"]', '["sensitivity","dullness"]', 'toner', FALSE, TRUE, 4.5, 67),
('Clay Detox Mask', 'clay-detox-mask', 'A purifying clay mask that draws out impurities and controls excess oil.', 'Kaolin Clay, Bentonite, Water, Charcoal, Tea Tree Oil, Witch Hazel, Niacinamide', 'Apply an even layer to clean skin. Leave for 10-15 minutes. Rinse with warm water. Use 1-2 times weekly.', 220.00, NULL, 45, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='mask'), '["oily","combination"]', '["acne","pores"]', 'mask', FALSE, FALSE, 4.4, 45),
('Anti-Aging Eye Cream', 'anti-aging-eye-cream', 'Targeted eye cream that reduces fine lines, dark circles, and puffiness.', 'Water, Caffeine, Peptides, Retinol, Hyaluronic Acid, Vitamin E, Niacinamide', 'Gently pat a small amount around the eye area morning and evening.', 380.00, 320.00, 35, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='eye-cream'), '["dry","normal","combination"]', '["wrinkles","dullness"]', 'eye_cream', TRUE, FALSE, 4.7, 78),
('BHA Exfoliating Liquid', 'bha-exfoliating-liquid', 'A chemical exfoliant with salicylic acid that unclogs pores and smooths skin texture.', 'Water, Salicylic Acid (2%), Willow Bark Extract, Niacinamide, Green Tea, Glycerin', 'Apply with a cotton pad after cleansing. Start 2-3 times weekly. Always use sunscreen.', 240.00, NULL, 60, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='exfoliator'), '["oily","combination"]', '["acne","pores","dullness"]', 'exfoliator', FALSE, TRUE, 4.6, 92),
('Niacinamide Pore Refiner', 'niacinamide-pore-refiner', 'A lightweight serum with niacinamide that minimizes pores and regulates oil production.', 'Water, Niacinamide (10%), Zinc PCA, Hyaluronic Acid, Allantoin', 'Apply 3-4 drops to clean skin morning and evening before moisturizer.', 280.00, 240.00, 70, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='serum'), '["oily","combination"]', '["pores","acne"]', 'serum', FALSE, TRUE, 4.5, 110),
('Retinol Night Treatment', 'retinol-night-treatment', 'A potent retinol treatment that works overnight to reduce wrinkles and improve skin texture.', 'Water, Retinol (0.5%), Squalane, Glycerin, Vitamin E, Peptides, Ceramides', 'Apply a pea-sized amount to clean skin at night. Start every other night. Always use sunscreen.', 420.00, 350.00, 40, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='serum'), '["dry","normal","combination"]', '["wrinkles","pigmentation","dullness"]', 'serum', TRUE, FALSE, 4.8, 134)
ON DUPLICATE KEY UPDATE name=name;

-- Product Images (using Pexels stock photos)
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='vitamin-c-brightening-serum'), 'https://images.pexels.com/photos/3018843/pexels-photo-3018843.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='hydrating-hyaluronic-moisturizer'), 'https://images.pexels.com/photos/3735628/pexels-photo-3735628.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='gentle-foaming-cleanser'), 'https://images.pexels.com/photos/4202392/pexels-photo-4202392.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='mineral-sunscreen-spf-50'), 'https://images.pexels.com/photos/4051392/pexels-photo-4051392.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='soothing-rose-toner'), 'https://images.pexels.com/photos/4202393/pexels-photo-4202393.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='clay-detox-mask'), 'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='anti-aging-eye-cream'), 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='bha-exfoliating-liquid'), 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='niacinamide-pore-refiner'), 'https://images.pexels.com/photos/5938567/pexels-photo-5938567.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='retinol-night-treatment'), 'https://images.pexels.com/photos/4051395/pexels-photo-4051395.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0);

-- Sample coupon
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, is_active) VALUES
('WELCOME10', '10% off your first order', 'percentage', 10, 0, TRUE)
ON DUPLICATE KEY UPDATE code=code;
