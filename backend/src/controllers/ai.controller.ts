import { Request, Response, NextFunction } from 'express';
import { aiService, IChatMessage } from '../services/ai.service';
import { AppError } from '../utils/AppError';

export class AiController {
  chat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return next(new AppError('A valid text message is required', 400));
      }

      if (message.trim().length > 1000) {
        return next(new AppError('Message is too long (maximum 1000 characters)', 400));
      }

      // Validate history format if provided
      let formattedHistory: IChatMessage[] = [];
      if (history) {
        if (!Array.isArray(history)) {
          return next(new AppError('History must be an array of messages', 400));
        }

        const isValid = history.every(
          (item) =>
            item &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.content === 'string',
        );

        if (!isValid) {
          return next(
            new AppError('History contains invalid message structure (expected role and content)', 400),
          );
        }

        formattedHistory = history;
      }

      const reply = await aiService.generateChatResponse(message.trim(), formattedHistory);

      res.status(200).json({
        success: true,
        data: {
          reply,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const aiController = new AiController();