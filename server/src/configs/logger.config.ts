import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}][${level}]: ${message}`;
});

export const WinstonLogger = {
  // 전역적으로 적용할 포맷 설정
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), logFormat),
  transports: [
    new DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      filename: `logFile-error.log`,
      dirname: '../logs',
      maxFiles: '7d',
      maxSize: '10m',
    }),
    new DailyRotateFile({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      filename: `logFile.log`,
      dirname: '../logs',
      maxFiles: '7d',
      maxSize: '10m',
    }),
    new DailyRotateFile({
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      filename: `logFile-warn.log`,
      dirname: '../logs',
      maxFiles: '7d',
      maxSize: '10m',
    }),
  ],
};
