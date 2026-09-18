import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { protect } from '../middlewares/auth.middleware';
import { uploadCV, uploadImage } from '../middlewares/upload.middleware';

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

// Protected Admin image upload routes
// Supports batch or individual field uploads (homeProfileImage, aboutProfileImage, universityImage, collegeImage, schoolImage)
router.post(
  '/images',
  protect,
  uploadImage.any(),
  settingsController.uploadImages,
);

router.post(
  '/images/:imageType',
  protect,
  uploadImage.single('image'),
  settingsController.uploadImages,
);

export default router;