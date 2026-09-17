import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import { AppError } from './utils/AppError';
import { errorHandler } from './middlewares/errorHandler';
import { globalLimiter, aiLimiter, contactLimiter } from './middlewares/rateLimiter';

import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import skillRoutes from './routes/skill.routes';
import experienceRoutes from './routes/experience.routes';
import settingsRoutes from './routes/settings.routes';
import contactRoutes from './routes/contact.routes';
import aiRoutes from './routes/ai.routes';

const app: Application = express();

// ==========================================
// 🛡️ SECURITY MIDDLEWARES
// ==========================================

// 1. Set Security HTTP Headers
app.use(helmet());

// 2. Configure CORS
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// 3. Apply Global Rate Limiting
app.use('/api', globalLimiter);

// 4. Parse JSON
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 5. PATCH FOR EXPRESS 5: Unlock req.query so sanitizers don't crash
app.use((req: Request, res: Response, next: NextFunction) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

// 6. Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// 7. Prevent HTTP Parameter Pollution
app.use(hpp());

// ==========================================
// 🚀 ROUTES
// ==========================================

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/experiences', experienceRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Apply strict rate limiters
app.use('/api/v1/contact', contactLimiter, contactRoutes);
app.use('/api/v1/ai', aiLimiter, aiRoutes);

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Dynamic Portfolio API is running securely.',
    timestamp: new Date().toISOString(),
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
});

app.use(errorHandler);

export default app;