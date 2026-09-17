import { projectRepository, ProjectRepository } from '../repositories/project.repository';
import { IProject } from '../models/project.model';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';

export class ProjectService {
  constructor(private readonly repo: ProjectRepository) {}

  async getAllProjects(isAdmin: boolean = false): Promise<IProject[]> {
    if (isAdmin) {
      return await this.repo.findAllAdmin();
    }
    return await this.repo.findPublished();
  }

  async getProjectBySlug(slug: string, isAdmin: boolean = false): Promise<IProject> {
    const project = await this.repo.findBySlug(slug);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (!project.isPublished && !isAdmin) {
      throw new AppError('Project not found', 404);
    }

    return project;
  }

  async createProject(data: Partial<IProject>): Promise<IProject> {
    if (!data.title) {
      throw new AppError('A project title is required', 400);
    }

    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);

    // Verify slug uniqueness
    const existing = await this.repo.findBySlug(baseSlug);
    if (existing) {
      throw new AppError('A project with this title or slug already exists', 400);
    }

    data.slug = baseSlug;
    return await this.repo.create(data);
  }

  async updateProject(id: string, data: Partial<IProject>): Promise<IProject> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError('Project not found', 404);
    }

    // If updating title/slug, guarantee slug remains unique
    if (data.title && !data.slug) {
      const generatedSlug = slugify(data.title);
      if (generatedSlug !== existing.slug) {
        const slugCollision = await this.repo.findBySlug(generatedSlug);
        if (slugCollision) {
          throw new AppError('A project with this title already exists', 400);
        }
        data.slug = generatedSlug;
      }
    } else if (data.slug) {
      data.slug = slugify(data.slug);
      if (data.slug !== existing.slug) {
        const slugCollision = await this.repo.findBySlug(data.slug);
        if (slugCollision) {
          throw new AppError('Slug is already in use by another project', 400);
        }
      }
    }

    const updated = await this.repo.updateById(id, data);
    if (!updated) {
      throw new AppError('Failed to update project', 500);
    }

    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(id);
    if (!deleted) {
      throw new AppError('Project not found', 404);
    }
  }
}

export const projectService = new ProjectService(projectRepository);