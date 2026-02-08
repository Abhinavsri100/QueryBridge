import { Router } from 'express';
import { addConnection, getConnections, executeQuery, deleteConnection } from '../controllers/dbController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { queryRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authMiddleware);

router.post('/', addConnection);
router.get('/', getConnections);
router.delete('/:id', deleteConnection);
router.post('/query', queryRateLimiter, executeQuery);

export default router;
