import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();

const authController = new AuthController();

router.get('/login', authController.login);
router.post('/login', authController.loginPost);
router.get('/register', authController.register);
router.post('/register', authController.registerPost);
router.get('/logout', authController.logout);

export default router;
