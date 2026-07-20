import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
