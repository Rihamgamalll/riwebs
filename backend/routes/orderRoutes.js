import { Router } from 'express';
import {
  getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder,
} from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware, optionalAuth } from '../middleware/auth.js';
import { validateOrder } from '../middleware/validation.js';

const router = Router();

router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/', optionalAuth, validateOrder, createOrder);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOrder);

export default router;
