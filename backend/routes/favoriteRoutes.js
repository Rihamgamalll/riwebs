import { Router } from 'express';
import {
  getFavorites, addFavorite, removeFavorite, checkFavorite,
} from '../controllers/favoriteController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, getFavorites);
router.post('/', authMiddleware, addFavorite);
router.delete('/:productId', authMiddleware, removeFavorite);
router.get('/check/:productId', authMiddleware, checkFavorite);

export default router;
