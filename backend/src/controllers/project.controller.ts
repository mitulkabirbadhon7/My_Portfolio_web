import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';

export class ProjectController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if authenticated user is requesting all projects (including drafts)
      const isAdmin = !!req.user;
      const projects = await projectService.getAllProjects(isAdmin);

      res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ Fixed by asserting the type
      const { slug } = req.params as { slug: string };
      const isAdmin = !!req.user;
      const project = await projectService.getProjectBySlug(slug, isAdmin);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.createProject(req.body);

      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ Fixed by asserting the type
      const { id } = req.params as { id: string };
      const project = await projectService.updateProject(id, req.body);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ Fixed by asserting the type
      const { id } = req.params as { id: string };
      await projectService.deleteProject(id);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const projectController = new ProjectController();