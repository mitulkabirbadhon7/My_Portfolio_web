import { Router } from 'express';
import { skillController } from '../controllers/skill.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/', skillController.getAll);

// Protected Admin
router.post('/', protect, skillController.create);
router.put('/:id', protect, skillController.update);
router.delete('/:id', protect, skillController.delete);

export default router;