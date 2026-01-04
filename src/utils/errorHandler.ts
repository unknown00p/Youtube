export class AppError extends Error {
  statusCode: number;
  error: Error

  constructor(statusCode: number, message: string, error:Error) {
    super(message);
    this.statusCode = statusCode;
    this.error = error
    Error.captureStackTrace(this, this.constructor);
  }
}