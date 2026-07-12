import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import auth from '../middleware/auth.js';

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/profile', auth, authController.getProfile);

export default router;
