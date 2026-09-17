import rateLimit from 'express-rate-limit';

// Global API Limiter: 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// AI Limiter: 10 requests per 15 minutes to prevent LLM quota draining
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'AI request limit reached (10 per 15 mins). Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact Limiter: 5 requests per 15 minutes to prevent email spam
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many contact messages sent. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});