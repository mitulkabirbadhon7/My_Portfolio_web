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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://mitulkabirbadhon.me',
  'https://www.mitulkabirbadhon.me',
  ...(process.env.FRONTEND_URL
    ? [
        process.env.FRONTEND_URL.replace(/\/+$/, '').trim(),
        process.env.FRONTEND_URL.replace(/\/+$/, '').trim().replace('https://', 'https://www.'),
        process.env.FRONTEND_URL.replace(/\/+$/, '').trim().replace('https://www.', 'https://'),
      ]
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '').trim();
      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.mitulkabirbadhon.me') ||
        normalizedOrigin.endsWith('.vercel.app');

      if (isAllowed) {
        callback(null, true);
      } else if (process.env.NODE_ENV !== 'production') {
        // In local development, permit any local port while logging a warning
        console.warn(`[CORS] Allowing development origin: ${origin}`);
        callback(null, true);
      } else {
        callback(new AppError(`Origin ${origin} not allowed by CORS`, 403));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
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