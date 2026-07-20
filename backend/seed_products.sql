-- ============================================================
-- 30 Additional Skincare Products for Riham's Beauty
-- ============================================================

USE rihams_beauty;

-- First, add 4 new categories
INSERT INTO categories (name, slug, description) VALUES
('Face Oil', 'face-oil', 'Nourishing facial oils for deep hydration'),
('Mist', 'mist', 'Refreshing facial mists and setting sprays'),
('Lip Care', 'lip-care', 'Lip balms, scrubs, and treatments'),
('Neck Cream', 'neck-cream', 'Specialized care for neck and decolletage')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================================
-- Products 11-40
-- ============================================================
INSERT INTO products (name, slug, description, ingredients, how_to_use, price, discount_price, stock, brand, category_id, skin_type, skin_concern, product_type, is_best_seller, is_new_arrival, rating, reviews_count) VALUES

-- 11
('Rosehip Regenerating Face Oil', 'rosehip-regenerating-face-oil',
'A lightweight facial oil rich in rosehip extract that regenerates skin cells and restores natural glow.',
'Rosehip Oil, Jojoba Oil, Vitamin E, Retinol, Argan Oil, Squalane',
'Apply 2-3 drops to clean skin evening. Gently press into face and neck.',
350.00, 290.00, 55, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='face-oil'),
'["dry","normal","combination"]', '["wrinkles","dullness","dryness"]', 'face_oil', TRUE, TRUE, 4.7, 67),

-- 12
('Green Tea Antioxidant Serum', 'green-tea-antioxidant-serum',
'A potent antioxidant serum with green tea extract that protects skin from environmental damage and premature aging.',
'Water, Green Tea Extract (5%), Vitamin C, Ferulic Acid, Hyaluronic Acid, Niacinamide',
'Apply 3-4 drops to clean skin in the morning before moisturizer.',
290.00, NULL, 75, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='serum'),
'["oily","combination","normal","sensitive"]', '["dullness","sensitivity","pigmentation"]', 'serum', FALSE, TRUE, 4.6, 43),

-- 13
('Ceramide Repair Moisturizer', 'ceramide-repair-moisturizer',
'A rich barrier-repair moisturizer with ceramides that restores and strengthens compromised skin barriers.',
'Water, Ceramides, Cholesterol, Hyaluronic Acid, Squalane, Panthenol, Niacinamide',
'Apply to clean skin morning and evening. Massage gently until fully absorbed.',
380.00, 320.00, 60, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='moisturizer'),
'["dry","sensitive","normal"]', '["sensitivity","dryness"]', 'moisturizer', TRUE, FALSE, 4.8, 92),

-- 14
('Aloe Soothing Gel Moisturizer', 'aloe-soothing-gel-moisturizer',
'A refreshing gel moisturizer with aloe vera that calms irritated skin while providing lightweight hydration.',
'Aloe Vera Gel (90%), Hyaluronic Acid, Green Tea Extract, Allantoin, Panthenol',
'Apply to clean skin morning and evening. Suitable for oily and acne-prone skin.',
220.00, 180.00, 100, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='moisturizer'),
'["oily","combination","sensitive"]', '["acne","sensitivity","dryness"]', 'moisturizer', FALSE, TRUE, 4.5, 78),

-- 15
('Salicylic Acid Cleanser', 'salicylic-acid-cleanser',
'A deep-cleansing face wash with salicylic acid that targets acne and unclogs pores without over-drying.',
'Water, Salicylic Acid (2%), Cocamidopropyl Betaine, Glycerin, Tea Tree Oil, Niacinamide',
'Massage onto damp skin morning and evening. Rinse thoroughly.',
200.00, NULL, 85, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='cleanser'),
'["oily","combination"]', '["acne","pores"]', 'cleanser', TRUE, FALSE, 4.6, 145),

-- 16
('Micellar Cleansing Water', 'micellar-cleansing-water',
'A gentle micellar water that removes makeup, dirt, and oil in one swipe without rinsing.',
'Water, Glycerin, Poloxamer 184, Disodium EDTA, Panthenol, Allantoin',
'Soak a cotton pad and gently wipe across face. No rinsing needed.',
150.00, 120.00, 130, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='cleanser'),
'["oily","dry","combination","sensitive","normal"]', '["sensitivity","dullness"]', 'cleanser', FALSE, TRUE, 4.4, 56),

-- 17
('Vitamin E Nourishing Toner', 'vitamin-e-nourishing-toner',
'A hydrating toner with vitamin E that preps skin for better absorption of subsequent products.',
'Water, Vitamin E, Glycerin, Hyaluronic Acid, Panthenol, Allantoin, Green Tea Extract',
'After cleansing, apply with a cotton pad or pat gently with hands.',
170.00, NULL, 70, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='toner'),
'["dry","sensitive","normal"]', '["dryness","sensitivity"]', 'toner', FALSE, FALSE, 4.5, 34),

-- 18
('Witch Hazel Pore Refining Toner', 'witch-hazel-pore-refining-toner',
'A pore-refining toner with witch hazel that balances oil production and minimizes the appearance of pores.',
'Witch Hazel Extract, Water, Glycerin, Niacinamide, Tea Tree Oil, Salicylic Acid',
'After cleansing, apply with a cotton pad. Focus on T-zone and pore-prone areas.',
160.00, 130.00, 80, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='toner'),
'["oily","combination"]', '["pores","acne"]', 'toner', TRUE, FALSE, 4.6, 89),

-- 19
('Peptide Firming Eye Serum', 'peptide-firming-eye-serum',
'An advanced eye serum with peptides that firms, tightens, and rejuvenates the delicate eye area.',
'Water, Peptides, Caffeine, Hyaluronic Acid, Niacinamide, Vitamin E, Argireline',
'Gently pat a small amount around the eye area morning and evening.',
420.00, 360.00, 40, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='eye-cream'),
'["dry","normal","combination"]', '["wrinkles","dullness"]', 'eye_cream', FALSE, TRUE, 4.7, 52),

-- 20
('Caffeine Depuffing Eye Roller', 'caffeine-depuffing-eye-roller',
'A cooling eye roller with caffeine that instantly depuffs and brightens tired eyes.',
'Water, Caffeine (5%), Niacinamide, Hyaluronic Acid, Green Tea Extract, Aloe Vera',
'Roll gently under and around the eye area. Use morning and evening.',
190.00, NULL, 65, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='eye-cream'),
'["oily","dry","combination","sensitive","normal"]', '["dullness","sensitivity"]', 'eye_cream', FALSE, TRUE, 4.3, 41),

-- 21
('Charcoal Bubble Mask', 'charcoal-bubble-mask',
'A fun bubble mask with activated charcoal that deep-cleans pores and removes blackheads.',
'Activated Charcoal, Water, Tea Tree Oil, Clay, Green Tea Extract, Niacinamide',
'Apply an even layer to clean dry skin. Leave for 10 minutes until bubbles form. Rinse thoroughly.',
250.00, 200.00, 50, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='mask'),
'["oily","combination"]', '["acne","pores"]', 'mask', TRUE, TRUE, 4.5, 73),

-- 22
('Overnight Sleeping Mask', 'overnight-sleeping-mask',
'A luxurious overnight sleeping mask that intensely hydrates and repairs skin while you sleep.',
'Water, Hyaluronic Acid, Ceramides, Squalane, Niacinamide, Peptides, Lavender Extract',
'Apply as the last step of your nighttime routine. Rinse off in the morning.',
300.00, NULL, 45, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='mask'),
'["dry","sensitive","normal","combination"]', '["dryness","dullness"]', 'mask', FALSE, TRUE, 4.8, 58),

-- 23
('Glycolic Acid Exfoliating Toner', 'glycolic-acid-exfoliating-toner',
'A chemical exfoliating toner with glycolic acid that smooths skin texture and reveals a radiant complexion.',
'Water, Glycolic Acid (7%), Witch Hazel, Niacinamide, Aloe Vera, Green Tea Extract',
'Apply with a cotton pad 2-3 times weekly. Start slowly. Always use sunscreen.',
260.00, 220.00, 55, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='exfoliator'),
'["oily","combination","normal"]', '["dullness","pigmentation","pores"]', 'exfoliator', TRUE, FALSE, 4.6, 81),

-- 24
('PHAs Gentle Exfoliating Serum', 'phas-gentle-exfoliating-serum',
'A gentle exfoliating serum with polyhydroxy acids (PHAs) suitable for sensitive skin.',
'Water, Gluconolactone (8%), Lactobionic Acid, Hyaluronic Acid, Glycerin, Niacinamide',
'Apply 3-4 drops to clean skin 2-3 times weekly. Follow with moisturizer.',
230.00, NULL, 60, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='exfoliator'),
'["sensitive","dry","normal"]', '["dullness","sensitivity","pigmentation"]', 'exfoliator', FALSE, TRUE, 4.4, 37),

-- 25
('Tinted Mineral Sunscreen SPF 40', 'tinted-mineral-sunscreen-spf-40',
'A tinted mineral sunscreen with SPF 40 that provides natural coverage while protecting against UV damage.',
'Zinc Oxide (18%), Titanium Dioxide, Iron Oxides, Water, Glycerin, Niacinamide, Green Tea Extract',
'Apply generously as the last step in your morning routine. Blend evenly.',
320.00, 270.00, 70, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='sunscreen'),
'["oily","combination","normal","sensitive"]', '["pigmentation","sensitivity"]', 'sunscreen', FALSE, TRUE, 4.5, 64),

-- 26
('Water-Resistant Sport Sunscreen SPF 60', 'water-resistant-sport-sunscreen-spf-60',
'A high-protection water-resistant sunscreen ideal for outdoor activities and sports.',
'Avobenzone, Homosalate, Octisalate, Water, Glycerin, Vitamin E, Aloe Vera',
'Apply 15 minutes before sun exposure. Reapply every 80 minutes or after swimming.',
350.00, NULL, 50, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='sunscreen'),
'["oily","dry","combination","normal"]', '["pigmentation"]', 'sunscreen', FALSE, FALSE, 4.4, 29),

-- 27
('Hyaluronic Acid Hydrating Mist', 'hyaluronic-acid-hydrating-mist',
'A refreshing facial mist with hyaluronic acid that instantly hydrates and revitalizes skin anytime.',
'Water, Hyaluronic Acid, Glycerin, Rose Water, Aloe Vera, Green Tea Extract, Panthenol',
'Spray 20cm from face whenever skin needs a boost. Can be used over makeup.',
180.00, 150.00, 90, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='mist'),
'["oily","dry","combination","sensitive","normal"]', '["dryness","dullness","sensitivity"]', 'mist', TRUE, TRUE, 4.6, 95),

-- 28
('Rose Damascena Setting Mist', 'rose-damascena-setting-mist',
'A luxurious rose water setting mist that locks in makeup while soothing and refreshing skin.',
'Rose Damascena Water, Glycerin, Hyaluronic Acid, Aloe Vera, Allantoin, Green Tea Extract',
'Spray after makeup application to set. Reapply throughout the day for a refresh.',
220.00, NULL, 55, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='mist'),
'["dry","sensitive","normal","combination"]', '["sensitivity","dullness"]', 'mist', FALSE, TRUE, 4.5, 48),

-- 29
('Squalane Lightweight Face Oil', 'squalane-lightweight-face-oil',
'A non-comedogenic face oil with squalane that moisturizes without clogging pores, perfect for all skin types.',
'Squalane (100%), Vitamin E',
'Apply 2-3 drops to clean skin. Can be mixed with moisturizer for extra hydration.',
280.00, 240.00, 65, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='face-oil'),
'["oily","dry","combination","sensitive","normal"]', '["dryness","sensitivity"]', 'face_oil', TRUE, FALSE, 4.7, 83),

-- 30
('Marula Anti-Aging Face Oil', 'marula-anti-aging-face-oil',
'A premium face oil with marula oil rich in antioxidants that fights signs of aging and nourishes deeply.',
'Marula Oil, Argan Oil, Vitamin E, Retinol, Rosehip Oil, Jojoba Oil',
'Apply 2-3 drops to clean skin in the evening. Gently massage into face and neck.',
420.00, 350.00, 35, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='face-oil'),
'["dry","normal","combination"]', '["wrinkles","dullness","dryness"]', 'face_oil', FALSE, TRUE, 4.8, 39),

-- 31
('Lip Balm SPF 15 Tinted', 'lip-balm-spf-15-tinted',
'A moisturizing tinted lip balm with SPF 15 that protects and enhances your natural lip color.',
'Shea Butter, Beeswax, Cocoa Butter, SPF Filters, Vitamin E, Jojoba Oil, Pigments',
'Apply to lips as needed throughout the day.',
120.00, NULL, 150, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='lip-care'),
'["oily","dry","combination","sensitive","normal"]', '["dryness"]', 'lip_care', TRUE, FALSE, 4.5, 112),

-- 32
('Lip Sleeping Mask', 'lip-sleeping-mask',
'An overnight lip mask that deeply nourishes and repairs dry, chapped lips while you sleep.',
'Shea Butter, Hyaluronic Acid, Vitamin E, Ceramides, Squalane, Honey Extract',
'Apply a generous layer to lips before bed. Rinse off in the morning.',
160.00, 130.00, 80, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='lip-care'),
'["oily","dry","combination","sensitive","normal"]', '["dryness","sensitivity"]', 'lip_care', FALSE, TRUE, 4.6, 54),

-- 33
('Neck & Decolletage Firming Cream', 'neck-decolletage-firming-cream',
'A specialized firming cream for the neck and decolletage area that improves elasticity and smoothness.',
'Water, Peptides, Retinol, Hyaluronic Acid, Shea Butter, Vitamin E, Niacinamide',
'Apply to neck and decolletage morning and evening with upward strokes.',
380.00, 320.00, 40, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='neck-cream'),
'["dry","normal","combination"]', '["wrinkles","dullness","dryness"]', 'neck_cream', FALSE, TRUE, 4.5, 31),

-- 34
('Azelaic Acid Brightening Cream', 'azelaic-acid-brightening-cream',
'A targeted brightening cream with azelaic acid that reduces redness, hyperpigmentation, and acne marks.',
'Water, Azelaic Acid (10%), Niacinamide, Glycerin, Green Tea Extract, Panthenol',
'Apply a thin layer to affected areas morning and evening.',
300.00, NULL, 50, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='moisturizer'),
'["oily","combination","sensitive"]', '["pigmentation","acne","sensitivity"]', 'moisturizer', TRUE, TRUE, 4.7, 76),

-- 35
('Tranexamic Acid Dark Spot Corrector', 'tranexamic-acid-dark-spot-corrector',
'A powerful dark spot corrector with tranexamic acid that targets stubborn hyperpigmentation and melasma.',
'Water, Tranexamic Acid (3%), Niacinamide, Vitamin C, Kojic Acid, Hyaluronic Acid, Licorice Root',
'Apply a small amount to dark spots morning and evening. Use sunscreen during the day.',
450.00, 380.00, 30, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='serum'),
'["oily","dry","combination","normal"]', '["pigmentation","dullness"]', 'serum', FALSE, TRUE, 4.6, 42),

-- 36
('Probiotic Balance Cleanser', 'probiotic-balance-cleanser',
'A microbiome-friendly cleanser with probiotics that balances and protects skin''s natural defenses.',
'Water, Lactobacillus Ferment, Glycerin, Cocamidopropyl Betaine, Aloe Vera, Panthenol, Green Tea',
'Massage onto damp skin morning and evening. Rinse with lukewarm water.',
220.00, 180.00, 75, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='cleanser'),
'["sensitive","dry","normal"]', '["sensitivity","dryness"]', 'cleanser', FALSE, TRUE, 4.5, 47),

-- 37
('Centella Calming Gel Mask', 'centella-calming-gel-mask',
'A soothing gel mask with centella asiatica that calms redness and irritation in just 15 minutes.',
'Centella Asiatica Extract (60%), Water, Hyaluronic Acid, Panthenol, Aloe Vera, Green Tea',
'Apply an even layer to clean skin. Leave for 15-20 minutes. Rinse off. Use 2-3 times weekly.',
270.00, NULL, 50, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='mask'),
'["sensitive","dry","combination","normal"]', '["sensitivity","acne","dryness"]', 'mask', FALSE, TRUE, 4.6, 38),

-- 38
('Snail Mucin Repair Serum', 'snail-mucin-repair-serum',
'A best-selling repair serum with snail mucin that heals, regenerates, and improves skin texture.',
'Snail Mucin Filtrate (96%), Hyaluronic Acid, Niacinamide, Panthenol, Peptides, Green Tea Extract',
'Apply 3-4 drops to clean skin morning and evening. Follow with moisturizer.',
320.00, 270.00, 70, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='serum'),
'["oily","dry","combination","sensitive","normal"]', '["acne","wrinkles","dullness"]', 'serum', TRUE, FALSE, 4.8, 156),

-- 39
('Propolis Glow Ampoule', 'propolis-glow-ampoule',
'A nourishing ampoule with propolis extract that delivers a healthy, radiant glow.',
'Propolis Extract (50%), Hyaluronic Acid, Niacinamide, Vitamin E, Honey Extract, Glycerin',
'Apply 2-3 drops to clean skin morning and evening before moisturizer.',
280.00, NULL, 60, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='serum'),
'["dry","normal","combination"]', '["dullness","dryness","sensitivity"]', 'serum', FALSE, TRUE, 4.6, 49),

-- 40
('B5 Panthenol Repair Cream', 'b5-panthenol-repair-cream',
'A deeply reparative cream with panthenol (Vitamin B5) that soothes and restores damaged skin barriers.',
'Water, Panthenol (5%), Madecassoside, Ceramides, Hyaluronic Acid, Shea Butter, Niacinamide',
'Apply to clean skin morning and evening. Especially beneficial for compromised skin.',
340.00, 290.00, 45, 'Riham''s Beauty', (SELECT id FROM categories WHERE slug='moisturizer'),
'["sensitive","dry","normal"]', '["sensitivity","dryness","acne"]', 'moisturizer', FALSE, TRUE, 4.7, 63)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================================
-- Product Images — using Pexels stock photos
-- ============================================================
INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
((SELECT id FROM products WHERE slug='rosehip-regenerating-face-oil'), 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='green-tea-antioxidant-serum'), 'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='ceramide-repair-moisturizer'), 'https://images.pexels.com/photos/5938587/pexels-photo-5938587.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='aloe-soothing-gel-moisturizer'), 'https://images.pexels.com/photos/4041393/pexels-photo-4041393.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='salicylic-acid-cleanser'), 'https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='micellar-cleansing-water'), 'https://images.pexels.com/photos/4051393/pexels-photo-4051393.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='vitamin-e-nourishing-toner'), 'https://images.pexels.com/photos/4202393/pexels-photo-4202393.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='witch-hazel-pore-refining-toner'), 'https://images.pexels.com/photos/3997381/pexels-photo-3997381.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='peptide-firming-eye-serum'), 'https://images.pexels.com/photos/3373738/pexels-photo-3373738.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='caffeine-depuffing-eye-roller'), 'https://images.pexels.com/photos/3997385/pexels-photo-3997385.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='charcoal-bubble-mask'), 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='overnight-sleeping-mask'), 'https://images.pexels.com/photos/4041395/pexels-photo-4041395.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='glycolic-acid-exfoliating-toner'), 'https://images.pexels.com/photos/4051392/pexels-photo-4051392.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='phas-gentle-exfoliating-serum'), 'https://images.pexels.com/photos/5938567/pexels-photo-5938567.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='tinted-mineral-sunscreen-spf-40'), 'https://images.pexels.com/photos/4051396/pexels-photo-4051396.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='water-resistant-sport-sunscreen-spf-60'), 'https://images.pexels.com/photos/4051397/pexels-photo-4051397.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='hyaluronic-acid-hydrating-mist'), 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='rose-damascena-setting-mist'), 'https://images.pexels.com/photos/4041396/pexels-photo-4041396.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='squalane-lightweight-face-oil'), 'https://images.pexels.com/photos/3018843/pexels-photo-3018843.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='marula-anti-aging-face-oil'), 'https://images.pexels.com/photos/3735628/pexels-photo-3735628.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='lip-balm-spf-15-tinted'), 'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='lip-sleeping-mask'), 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='neck-decolletage-firming-cream'), 'https://images.pexels.com/photos/4051392/pexels-photo-4051392.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='azelaic-acid-brightening-cream'), 'https://images.pexels.com/photos/5938587/pexels-photo-5938587.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='tranexamic-acid-dark-spot-corrector'), 'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='probiotic-balance-cleanser'), 'https://images.pexels.com/photos/4202392/pexels-photo-4202392.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='centella-calming-gel-mask'), 'https://images.pexels.com/photos/3997389/pexels-photo-3997389.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='snail-mucin-repair-serum'), 'https://images.pexels.com/photos/4041393/pexels-photo-4041393.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='propolis-glow-ampoule'), 'https://images.pexels.com/photos/4051395/pexels-photo-4051395.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0),
((SELECT id FROM products WHERE slug='b5-panthenol-repair-cream'), 'https://images.pexels.com/photos/3735628/pexels-photo-3735628.jpeg?auto=compress&cs=tinysrgb&w=800', TRUE, 0);
