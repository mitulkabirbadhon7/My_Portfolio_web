import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { protect, optionalAuth } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (with optional auth to detect Admin requesting drafts)
router.get('/', optionalAuth, projectController.getAll);
router.get('/:slug', optionalAuth, projectController.getBySlug);

// Protected Admin routes
router.post('/', protect, projectController.create);
router.put('/:id', protect, projectController.update);
router.delete('/:id', protect, projectController.delete);

export default router;