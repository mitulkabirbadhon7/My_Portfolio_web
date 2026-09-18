import { Readable } from 'stream';
import cloudinary from '../config/cloudinary';
import { settingsRepository, SettingsRepository } from '../repositories/settings.repository';
import { ISettings } from '../models/settings.model';
import { AppError } from '../utils/AppError';

export class SettingsService {
  constructor(private readonly repo: SettingsRepository) {}

  async getSettings(): Promise<ISettings> {
    const settings = await this.repo.getOrCreate();
    let needsSave = false;

    if (
      !settings.contactEmail ||
      settings.contactEmail === 'developer@example.com' ||
      settings.contactEmail === 'contact@example.com'
    ) {
      settings.contactEmail = 'mitulkabirbadhon7@gmail.com';
      needsSave = true;
    }

    if (!settings.githubUrl || settings.githubUrl.includes('your-actual-username')) {
      settings.githubUrl = 'https://github.com/mitulkabirbadhon7';
      needsSave = true;
    }

    if (!settings.linkedinUrl || settings.linkedinUrl.includes('your-actual-profile')) {
      settings.linkedinUrl = 'https://linkedin.com/in/mitulkabirbadhon';
      needsSave = true;
    }

    if (needsSave) {
      await settings.save();
    }

    return settings;
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

  private uploadImageBufferToCloudinary(
    file: Express.Multer.File,
    folder = 'portfolio/images',
    prefix = 'img',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          public_id: `${prefix}_${Date.now()}`,
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new AppError(
                `Cloudinary Upload Failed: ${error?.message || 'Unknown error'}`,
                500,
              ),
            );
          }
          resolve(result.secure_url);
        },
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(stream);
    });
  }

  async uploadImages(
    files?:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[],
    singleFile?: Express.Multer.File,
    fieldName?: string,
  ): Promise<ISettings> {
    const validFields: Array<keyof ISettings> = [
      'homeProfileImage',
      'aboutProfileImage',
      'universityImage',
      'collegeImage',
      'schoolImage',
      'signatureImage',
    ];

    const updates: Partial<ISettings> = {};

    // Case 1: Multiple named files object (e.g., from upload.fields)
    if (files && !Array.isArray(files)) {
      for (const key of Object.keys(files)) {
        if (validFields.includes(key as keyof ISettings)) {
          const fileArr = files[key];
          if (fileArr && fileArr.length > 0) {
            const url = await this.uploadImageBufferToCloudinary(fileArr[0], 'portfolio/images', key);
            (updates as Record<string, string>)[key] = url;
          }
        }
      }
    }

    // Case 2: Array of files (e.g., upload.any())
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (validFields.includes(file.fieldname as keyof ISettings)) {
          const url = await this.uploadImageBufferToCloudinary(file, 'portfolio/images', file.fieldname);
          (updates as Record<string, string>)[file.fieldname] = url;
        }
      }
    }

    // Case 3: Single file passed with fieldName
    if (singleFile && fieldName && validFields.includes(fieldName as keyof ISettings)) {
      const url = await this.uploadImageBufferToCloudinary(singleFile, 'portfolio/images', fieldName);
      (updates as Record<string, string>)[fieldName] = url;
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError('No valid image files provided for upload', 400);
    }

    return await this.repo.updateSingleton(updates);
  }
}

export const settingsService = new SettingsService(settingsRepository);