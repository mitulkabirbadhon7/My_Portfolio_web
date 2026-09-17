import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required (e.g., Frontend, Backend, DevOps, Tools)'],
      trim: true,
    },
    proficiency: {
      type: Number,
      min: [1, 'Proficiency must be at least 1'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 80,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

// Index category for rapid grouped queries
SkillSchema.index({ category: 1 });

export const SkillModel = mongoose.model<ISkill>('Skill', SkillSchema);