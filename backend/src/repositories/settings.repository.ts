import { BaseRepository } from './base.repository';
import { ISettings, SettingsModel } from '../models/settings.model';

export class SettingsRepository extends BaseRepository<ISettings> {
  constructor() {
    super(SettingsModel);
  }

  // Ensures only one settings record exists
  async getOrCreate(): Promise<ISettings> {
    let settings = await this.model.findOne().exec();
    if (!settings) {
      settings = await this.model.create({});
    }
    return settings;
  }

  async updateSingleton(data: Partial<ISettings>): Promise<ISettings> {
    const settings = await this.getOrCreate();
    const updated = await this.model
      .findByIdAndUpdate(settings._id, data, { new: true })
      .exec();
    return updated!;
  }
}

export const settingsRepository = new SettingsRepository();