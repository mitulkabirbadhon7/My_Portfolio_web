export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Operational errors are predictable (e.g. "User not found", "Invalid input")
    // Non-operational errors are bugs (e.g. undefined variable, database crash)
    this.isOperational = true;

    // Capture the stack trace but exclude this constructor from it
    Error.captureStackTrace(this, this.constructor);
  }
}