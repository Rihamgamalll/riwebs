import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/product', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/products/${req.file.filename}`;
  res.status(201).json({ image_url: imageUrl });
});

export default router;
