import {
  experienceRepository,
  ExperienceRepository,
} from '../repositories/experience.repository';
import { IExperience } from '../models/experience.model';
import { AppError } from '../utils/AppError';

export class ExperienceService {
  constructor(private readonly repo: ExperienceRepository) {}

  async getAllExperiences(): Promise<IExperience[]> {
    return await this.repo.findAllChronological();
  }

  async createExperience(data: Partial<IExperience>): Promise<IExperience> {
    if (!data.company || !data.role || !data.startDate) {
      throw new AppError('Company, role, and startDate are required', 400);
    }

    if (data.current) {
      data.endDate = undefined;
    } else if (!data.endDate) {
      throw new AppError('Non-current experiences must have an endDate', 400);
    }

    return await this.repo.create(data);
  }

  async updateExperience(
    id: string,
    data: Partial<IExperience>,
  ): Promise<IExperience> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError('Experience record not found', 404);
    }

    if (data.current === true) {
      data.endDate = undefined;
    }

    const updated = await this.repo.updateById(id, data);
    if (!updated) {
      throw new AppError('Failed to update experience', 500);
    }

    return updated;
  }

  async deleteExperience(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(id);
    if (!deleted) {
      throw new AppError('Experience record not found', 404);
    }
  }
}

export const experienceService = new ExperienceService(experienceRepository);