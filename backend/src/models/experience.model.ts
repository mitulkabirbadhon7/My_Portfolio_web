import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema: Schema = new Schema(
  {
    company: {
      type: String,
      required: [true, 'Company or institution name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role or degree title is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Index start date in descending order for chronological display
ExperienceSchema.index({ startDate: -1 });

export const ExperienceModel = mongoose.model<IExperience>(
  'Experience',
  ExperienceSchema,
);