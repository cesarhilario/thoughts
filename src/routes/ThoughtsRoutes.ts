import { checkAuth } from '@/helpers/checkAuth';
import express from 'express';
import { ThoughController } from '../controllers/ThoughController';

const router = express.Router();

const thoughController = new ThoughController();

router.get('/add', checkAuth, thoughController.createThought);
router.post('/add', checkAuth, thoughController.createThoughtSave);
router.post('/remove', checkAuth, thoughController.removeThought);
router.get('/edit/:id', checkAuth, thoughController.updateThought);
router.post('/edit', checkAuth, thoughController.updateThoughtPost);
router.get('/dashboard', checkAuth, thoughController.dashboard);
router.get('/', ThoughController.showThoughts);

export default router;
