import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';

const router = Router();

// Public chat route (Will receive dedicated rate limiting in Phase 14)
router.post('/chat', aiController.chat);

export default router;