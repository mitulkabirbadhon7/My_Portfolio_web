import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';

const router = Router();

// Public endpoint to send emails
router.post('/', contactController.sendMessage);

export default router;