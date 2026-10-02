import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { UserModel } from '../models/user.model';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check for token in Bearer header (primary/cross-origin) OR cookies (HttpOnly fallback)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]?.trim();
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token || token === 'logged_out') {
      return next(
        new AppError('You are not logged in. Please log in to get access.', 401),
      );
    }

    // 2. Verify token integrity and expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // 3. Check if user still exists in database
    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401),
      );
    }

    // 4. Grant access: Attach user to the request object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new AppError('Your session has expired. Please log in again.', 401),
      );
    }
    next(error);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]?.trim();
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (token && token !== 'logged_out') {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string,
        ) as JwtPayload;
        const currentUser = await UserModel.findById(decoded.id);
        if (currentUser) {
          req.user = currentUser;
        }
      } catch {
        // Token invalid/expired - proceed as guest
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};