import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  content?: string;
  techStack: string[];
  image?: string;
  demoUrl?: string;
  repoUrl?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    demoUrl: {
      type: String,
      default: '',
    },
    repoUrl: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index slug for fast lookup on public dynamic routes
ProjectSchema.index({ slug: 1 });

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);