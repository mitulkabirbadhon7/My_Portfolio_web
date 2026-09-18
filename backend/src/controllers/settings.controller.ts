import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service';

export class SettingsController {
  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.getSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.updateSettings(req.body);
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadCV = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.uploadCVFile(req.file);
      res.status(200).json({
        success: true,
        message: 'CV uploaded successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fieldName = (req.body?.imageType || req.params?.imageType) as string | undefined;
      const settings = await settingsService.uploadImages(
        req.files as
          | { [fieldname: string]: Express.Multer.File[] }
          | Express.Multer.File[]
          | undefined,
        req.file,
        fieldName,
      );

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const settingsController = new SettingsController();