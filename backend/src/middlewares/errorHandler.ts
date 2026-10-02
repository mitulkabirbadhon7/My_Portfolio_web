import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // Handle Multer upload errors gracefully
  if (err.name === 'MulterError') {
    const multerErr = err as any;
    let message = multerErr.message || 'File upload failed';
    if (multerErr.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large. Maximum allowed size is 5MB.';
    } else if (multerErr.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Unexpected upload field: ${multerErr.field || 'unknown'}.`;
    }
    return res.status(400).json({
      success: false,
      message,
    });
  }

  const isAppError =
    err instanceof AppError ||
    (Boolean(err) && typeof err === 'object' && 'statusCode' in err && 'isOperational' in err);
  const statusCode = isAppError
    ? (err as AppError).statusCode
    : (err as any)?.statusCode || 500;
  const isOperational = isAppError
    ? (err as AppError).isOperational
    : Boolean((err as any)?.isOperational);

  // Fail-secure check: explicitly verify development environment
  const isDev = process.env.NODE_ENV === 'development';

  // Mask unhandled internal 500 errors in production
  let message = err.message;
  if (!isOperational && !isDev) {
    message = 'An unexpected internal error occurred. Please try again later.';
  }

  const response: {
    success: boolean;
    message: string;
    stack?: string;
  } = {
    success: false,
    message,
  };

  // SECURITY HARDENING:
  // 1. Never attach stack traces to 4xx operational errors (validation/auth/not found).
  // 2. Only expose stack traces for 500 internal crashes while actively in development.
  if (isDev && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};