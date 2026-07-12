import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { validateSignup, validateLogin } from '../validators/auth.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', validateSignup, validateRequest, signup);
router.post('/login', validateLogin, validateRequest, login);
router.get('/me', authenticateToken, getMe);

export default router;
