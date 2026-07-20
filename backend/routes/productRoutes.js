import { Router } from 'express';
import {
  getAllProducts, getProductBySlug, getSimilarProducts,
  createProduct, updateProduct, deleteProduct, getProductsBySection,
} from '../controllers/productController.js';
import { validateProduct } from '../middleware/validation.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getAllProducts);
router.get('/section/:section', getProductsBySection);
router.get('/:slug', getProductBySlug);
router.get('/:slug/similar', getSimilarProducts);

// Admin
router.post('/', authMiddleware, adminMiddleware, validateProduct, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
