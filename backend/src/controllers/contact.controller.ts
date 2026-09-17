import { Request, Response, NextFunction } from 'express';
import { emailService } from '../services/email.service';
import { AppError } from '../utils/AppError';

export class ContactController {
  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return next(new AppError('Your name is required', 400));
      }

      if (!email || typeof email !== 'string') {
        return next(new AppError('A valid email address is required', 400));
      }

      // Basic regex for email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return next(new AppError('Please provide a valid email address format', 400));
      }

      if (!message || typeof message !== 'string' || message.trim().length < 10) {
        return next(
          new AppError('Message must be at least 10 characters in length', 400),
        );
      }

      if (message.length > 5000) {
        return next(new AppError('Message exceeds maximum limit of 5000 characters', 400));
      }

      await emailService.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim(),
        message: message.trim(),
      });

      res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully.',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const contactController = new ContactController();