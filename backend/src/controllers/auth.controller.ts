import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/AppError';

export class AuthController {
  private sendTokenResponse(user: any, token: string, statusCode: number, res: Response) {
    const cookieDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7', 10);
    
    const cookieOptions = {
      expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.status(statusCode).cookie('jwt', token, cookieOptions).json({
      success: true,
      user,
    });
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await authService.registerAdmin(req.body);
      this.sendTokenResponse(user, token, 201, res);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
      }

      const { user, token } = await authService.login(email, password);
      this.sendTokenResponse(user, token, 200, res);
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/auth/me (Requires protect middleware)
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.user is guaranteed to exist because protect executed first
      res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/auth/logout
  logout = (req: Request, res: Response) => {
    // Invalidate the cookie by setting it to a dummy value and expiring it immediately
    res.cookie('jwt', 'logged_out', {
      expires: new Date(Date.now() + 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Successfully logged out.',
    });
  };
}

export const authController = new AuthController();