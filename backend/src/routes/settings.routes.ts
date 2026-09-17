import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { protect } from '../middlewares/auth.middleware';
import { uploadCV } from '../middlewares/upload.middleware';

const router = Router();

// Public route to retrieve settings (including cvUrl, social links)
router.get('/', settingsController.getSettings);

// Protected Admin routes
router.put('/', protect, settingsController.updateSettings);
router.post(
  '/cv',
  protect,
  uploadCV.single('cv'), // Expects 'cv' multipart form field name
  settingsController.uploadCV,
);

export default router;