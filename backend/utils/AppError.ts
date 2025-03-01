export class AppError extends Error {
    public statusCode: number;
  
    constructor(message: string = "Internal Server Error", statusCode: number = 500) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }