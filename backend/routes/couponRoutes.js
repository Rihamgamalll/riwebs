import { Router } from 'express';
import {
  getAllCoupons, getActiveCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon,
} from '../controllers/couponController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getAllCoupons);
router.get('/active', getActiveCoupons);
router.get('/validate/:code', validateCoupon);
router.post('/', authMiddleware, adminMiddleware, createCoupon);
router.put('/:id', authMiddleware, adminMiddleware, updateCoupon);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCoupon);

export default router;
