import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  cvUrl?: string;
  contactEmail?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  homeProfileImage?: string;
  aboutProfileImage?: string;
  universityImage?: string;
  collegeImage?: string;
  schoolImage?: string;
  signatureImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  clientsWorldwide?: string;
  universityName?: string;
  universityDegree?: string;
  universityResult?: string;
  universityYear?: string;
  collegeName?: string;
  collegeDegree?: string;
  collegeResult?: string;
  collegeYear?: string;
  schoolName?: string;
  schoolDegree?: string;
  schoolResult?: string;
  schoolYear?: string;
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
      default: 'mitulkabirbadhon7@gmail.com',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/mitulkabirbadhon7',
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: 'https://linkedin.com/in/mitulkabirbadhon',
      trim: true,
    },
    facebookUrl: {
      type: String,
      default: '',
      trim: true,
    },
    instagramUrl: {
      type: String,
      default: '',
      trim: true,
    },
    clientsWorldwide: {
      type: String,
      default: '+12',
      trim: true,
    },
    homeProfileImage: {
      type: String,
      default: '',
      trim: true,
    },
    aboutProfileImage: {
      type: String,
      default: '',
      trim: true,
    },
    universityImage: {
      type: String,
      default: '',
      trim: true,
    },
    collegeImage: {
      type: String,
      default: '',
      trim: true,
    },
    schoolImage: {
      type: String,
      default: '',
      trim: true,
    },
    signatureImage: {
      type: String,
      default: '',
      trim: true,
    },
    // Educational Milestones Information
    universityName: {
      type: String,
      default: 'American International University-Bangladesh (AIUB)',
      trim: true,
    },
    universityDegree: {
      type: String,
      default: 'B.Sc. in Computer Science & Engineering',
      trim: true,
    },
    universityResult: {
      type: String,
      default: 'CGPA 3.85 / 4.00',
      trim: true,
    },
    universityYear: {
      type: String,
      default: '2020 – 2024',
      trim: true,
    },
    collegeName: {
      type: String,
      default: 'Higher Secondary College',
      trim: true,
    },
    collegeDegree: {
      type: String,
      default: 'Higher Secondary Certificate (HSC) • Science',
      trim: true,
    },
    collegeResult: {
      type: String,
      default: 'GPA 5.00 / 5.00',
      trim: true,
    },
    collegeYear: {
      type: String,
      default: '2017 – 2019',
      trim: true,
    },
    schoolName: {
      type: String,
      default: 'Secondary High School',
      trim: true,
    },
    schoolDegree: {
      type: String,
      default: 'Secondary School Certificate (SSC) • Science',
      trim: true,
    },
    schoolResult: {
      type: String,
      default: 'GPA 5.00 / 5.00',
      trim: true,
    },
    schoolYear: {
      type: String,
      default: '2015 – 2017',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SettingsModel = mongoose.model<ISettings>('Settings', SettingsSchema);