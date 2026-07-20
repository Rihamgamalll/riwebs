export function validateProduct(req, res, next) {
  const { name, price, stock } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  if (price === undefined || price === '' || isNaN(Number(price))) {
    return res.status(400).json({ error: 'Valid price is required' });
  }
  if (stock === undefined || stock === '' || isNaN(Number(stock))) {
    return res.status(400).json({ error: 'Valid stock quantity is required' });
  }
  next();
}

export function validateOrder(req, res, next) {
  const { full_name, phone, governorate, city, address_detail, items, payment_method } = req.body;
  if (!full_name?.trim()) return res.status(400).json({ error: 'Full name is required' });
  if (!phone?.trim()) return res.status(400).json({ error: 'Phone number is required' });
  if (!governorate?.trim()) return res.status(400).json({ error: 'Governorate is required' });
  if (!city?.trim()) return res.status(400).json({ error: 'City is required' });
  if (!address_detail?.trim()) return res.status(400).json({ error: 'Address is required' });
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }
  if (!payment_method) return res.status(400).json({ error: 'Payment method is required' });
  next();
}

export function validateRegister(req, res, next) {
  const { full_name, email, password } = req.body;
  if (!full_name?.trim()) return res.status(400).json({ error: 'Full name is required' });
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });
  next();
}

export function validateReview(req, res, next) {
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  next();
}
