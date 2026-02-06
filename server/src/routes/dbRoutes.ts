import { Router } from 'express';
import { addConnection, getConnections, executeQuery } from '../controllers/dbController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', addConnection);
router.get('/', getConnections);
router.post('/query', executeQuery);

export default router;
