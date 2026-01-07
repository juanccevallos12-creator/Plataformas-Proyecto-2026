// server/routes/auth.routes.js
import express from 'express';
import { AuthController } from '../controllers/auth.controller.js'; // ← CON S
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', auth, AuthController.me);
router.post('/change-password', auth, AuthController.changePassword);

export default router;