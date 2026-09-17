import { BaseRepository } from './base.repository';
import { IExperience, ExperienceModel } from '../models/experience.model';

export class ExperienceRepository extends BaseRepository<IExperience> {
  constructor() {
    super(ExperienceModel);
  }

  async findAllChronological(): Promise<IExperience[]> {
    return await this.model.find().sort({ startDate: -1 }).exec();
  }
}

export const experienceRepository = new ExperienceRepository();