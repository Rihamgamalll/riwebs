import { Router } from 'express';
import {
  getDashboardStats, getAllCustomers, getNotifications, markNotificationRead,
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/customers', authMiddleware, adminMiddleware, getAllCustomers);
router.get('/notifications', authMiddleware, adminMiddleware, getNotifications);
router.put('/notifications/:id/read', authMiddleware, adminMiddleware, markNotificationRead);

export default router;
