import { Request, Response, NextFunction } from 'express';
import { experienceService } from '../services/experience.service';

export class ExperienceController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const experiences = await experienceService.getAllExperiences();
      res.status(200).json({
        success: true,
        count: experiences.length,
        data: experiences,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const experience = await experienceService.createExperience(req.body);
      res.status(201).json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const experience = await experienceService.updateExperience(id, req.body);
      res.status(200).json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await experienceService.deleteExperience(id);
      res.status(200).json({
        success: true,
        message: 'Experience record deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const experienceController = new ExperienceController();