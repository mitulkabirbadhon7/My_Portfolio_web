import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AppError } from './utils/AppError';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import skillRoutes from './routes/skill.routes';
import experienceRoutes from './routes/experience.routes';
import settingsRoutes from './routes/settings.routes';
import contactRoutes from './routes/contact.routes';
import aiRoutes from './routes/ai.routes'; // <-- 1. IMPORT AI ROUTES

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/experiences', experienceRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/ai', aiRoutes); // <-- 2. MOUNT AI UNDER /api/v1/ai

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Dynamic Portfolio API is running smoothly.',
    timestamp: new Date().toISOString(),
  });
});

// Fallback for 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;