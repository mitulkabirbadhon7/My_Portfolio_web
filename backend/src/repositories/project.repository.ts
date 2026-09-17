import { BaseRepository } from './base.repository';
import { IProject, ProjectModel } from '../models/project.model';

export class ProjectRepository extends BaseRepository<IProject> {
  constructor() {
    super(ProjectModel);
  }

  async findBySlug(slug: string): Promise<IProject | null> {
    return await this.model.findOne({ slug }).exec();
  }

  async findPublished(): Promise<IProject[]> {
    return await this.model
      .find({ isPublished: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllAdmin(): Promise<IProject[]> {
    return await this.model.find().sort({ createdAt: -1 }).exec();
  }
}

export const projectRepository = new ProjectRepository();