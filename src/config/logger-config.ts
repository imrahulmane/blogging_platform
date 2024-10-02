import * as winston from 'winston';
import 'winston-daily-rotate-file';

//ustom format for logs
const customFormat = winston.format.printf(
  ({ level, message, timestamp, context, ...meta }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${meta.errorMessage ? `| Error: ${meta.errorMessage}` : ''} ${meta.statusCode ? `| Status: ${meta.statusCode}` : ''} ${meta.duration ? `| Duration: ${meta.duration}` : ''}`;
  },
);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss', // Timestamp format
    }),
    customFormat,
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // Keeps logs for the last 14 days
    }),
  ],
});

export { logger };
