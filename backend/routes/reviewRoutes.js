import { Router } from 'express';
import {
  getReviews, addReview, deleteReview,
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateReview } from '../middleware/validation.js';

const router = Router();

router.get('/:productId', getReviews);
router.post('/:productId', authMiddleware, validateReview, addReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
