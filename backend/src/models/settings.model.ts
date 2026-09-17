import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  cvUrl?: string;
  contactEmail?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    cvUrl: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SettingsModel = mongoose.model<ISettings>('Settings', SettingsSchema);