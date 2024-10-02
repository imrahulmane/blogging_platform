import { Injectable, NestMiddleware } from '@nestjs/common';
import { logger } from 'src/config/logger-config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, params, query, body } = req;
    const start = Date.now();

    // Log the incoming request
    logger.info(`Incoming Request: ${method} ${originalUrl}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      // Log error details if status code >= 400
      if (statusCode >= 400) {
        const errorMessage = res.statusMessage || 'Unknown error';
        logger.error(`Error Response: ${method} ${originalUrl}`, {
          statusCode,
          duration: `${duration}ms`,
          errorMessage,
        });
      } else {
        // Log the response with status code and duration
        logger.info(`Response: ${method} ${originalUrl}`, {
          statusCode,
          duration: `${duration}ms`,
        });
      }
    });

    next();
  }
}
