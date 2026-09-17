// Documented API response and entity types derived from docs/API_DOCUMENTATION.md and docs/DATABASE_SCHEMA.md

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  techStack: string[];
  image?: string;
  demoUrl?: string;
  repoUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string[];
}

export interface Settings {
  _id: string;
  cvUrl?: string;
  contactEmail?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  updatedAt?: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  count?: number;
  data?: T;
  user?: User;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}
