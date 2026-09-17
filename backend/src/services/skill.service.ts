import { skillRepository, SkillRepository } from '../repositories/skill.repository';
import { ISkill } from '../models/skill.model';
import { AppError } from '../utils/AppError';

export class SkillService {
  constructor(private readonly repo: SkillRepository) {}

  async getAllSkills(): Promise<ISkill[]> {
    return await this.repo.findAllGrouped();
  }

  async createSkill(data: Partial<ISkill>): Promise<ISkill> {
    if (!data.name || !data.category) {
      throw new AppError('Skill name and category are required', 400);
    }

    if (data.proficiency && (data.proficiency < 1 || data.proficiency > 100)) {
      throw new AppError('Proficiency must be between 1 and 100', 400);
    }

    return await this.repo.create(data);
  }

  async updateSkill(id: string, data: Partial<ISkill>): Promise<ISkill> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError('Skill not found', 404);
    }

    if (data.proficiency && (data.proficiency < 1 || data.proficiency > 100)) {
      throw new AppError('Proficiency must be between 1 and 100', 400);
    }

    const updated = await this.repo.updateById(id, data);
    if (!updated) {
      throw new AppError('Failed to update skill', 500);
    }

    return updated;
  }

  async deleteSkill(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(id);
    if (!deleted) {
      throw new AppError('Skill not found', 404);
    }
  }
}

export const skillService = new SkillService(skillRepository);