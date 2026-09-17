import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', projectController.getAll);
router.get('/:slug', projectController.getBySlug);

// Protected Admin routes
router.post('/', protect, projectController.create);
router.put('/:id', protect, projectController.update);
router.delete('/:id', protect, projectController.delete);

export default router;