import { Readable } from 'stream';
import cloudinary from '../config/cloudinary';
import { settingsRepository, SettingsRepository } from '../repositories/settings.repository';
import { ISettings } from '../models/settings.model';
import { AppError } from '../utils/AppError';

export class SettingsService {
  constructor(private readonly repo: SettingsRepository) {}

  async getSettings(): Promise<ISettings> {
    return await this.repo.getOrCreate();
  }

  async updateSettings(data: Partial<ISettings>): Promise<ISettings> {
    return await this.repo.updateSingleton(data);
  }

  async uploadCVFile(file?: Express.Multer.File): Promise<ISettings> {
    if (!file) {
      throw new AppError('No CV file provided for upload', 400);
    }

    // Wrap Cloudinary's upload_stream in a Promise
    const uploadToCloudinary = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio/cv',
            resource_type: 'raw', // Mandatory for non-image raw documents like PDF
            public_id: `cv_${Date.now()}`,
          },
          (error, result) => {
            if (error || !result) {
              return reject(
                new AppError(`Cloudinary Upload Failed: ${error?.message || 'Unknown error'}`, 500),
              );
            }
            resolve(result.secure_url);
          },
        );

        // Convert the Multer memory buffer into a readable stream and pipe it to Cloudinary
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(stream);
      });
    };

    const secureUrl = await uploadToCloudinary();

    // Persist the new CV URL into the singleton settings document
    return await this.repo.updateSingleton({ cvUrl: secureUrl });
  }
}

export const settingsService = new SettingsService(settingsRepository);