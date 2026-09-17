import { Request, Response, NextFunction } from 'express';
import { skillService } from '../services/skill.service';

export class SkillController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skills = await skillService.getAllSkills();
      res.status(200).json({
        success: true,
        count: skills.length,
        data: skills,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skill = await skillService.createSkill(req.body);
      res.status(201).json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ Fixed: Assert the param type
      const { id } = req.params as { id: string };
      const skill = await skillService.updateSkill(id, req.body);
      res.status(200).json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ Fixed: Assert the param type
      const { id } = req.params as { id: string };
      await skillService.deleteSkill(id);
      res.status(200).json({
        success: true,
        message: 'Skill deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const skillController = new SkillController();