import { BaseRepository } from './base.repository';
import { ISkill, SkillModel } from '../models/skill.model';

export class SkillRepository extends BaseRepository<ISkill> {
  constructor() {
    super(SkillModel);
  }

  async findAllGrouped(): Promise<ISkill[]> {
    return await this.model.find().sort({ category: 1, proficiency: -1 }).exec();
  }
}

export const skillRepository = new SkillRepository();