import { Router } from 'express';
import { experienceController } from '../controllers/experience.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/', experienceController.getAll);

// Protected Admin
router.post('/', protect, experienceController.create);
router.put('/:id', protect, experienceController.update);
router.delete('/:id', protect, experienceController.delete);

export default router;