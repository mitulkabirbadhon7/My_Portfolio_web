import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/AppError';

// Store files in RAM as Buffer objects to stream directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF files are allowed for CV uploads', 400));
  }
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB ceiling
  },
});

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif',
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (JPEG, PNG, WebP, GIF, SVG, AVIF) are allowed', 400));
  }
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB ceiling
  },
});

export const uploadSettingsImages = uploadImage.fields([
  { name: 'homeProfileImage', maxCount: 1 },
  { name: 'aboutProfileImage', maxCount: 1 },
  { name: 'universityImage', maxCount: 1 },
  { name: 'collegeImage', maxCount: 1 },
  { name: 'schoolImage', maxCount: 1 },
  { name: 'signatureImage', maxCount: 1 },
]);