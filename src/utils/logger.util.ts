import { Injectable, LoggerService } from '@nestjs/common';
import path from 'path';
import { fileURLToPath } from 'url';
import Winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const dirSaveName = path.join(dirName, '..', '..', 'logs');

// 로그 포맷 설정
const { combine, timestamp: defaultTimestamp, printf, splat, json } = Winston.format;

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const formatted = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

@Injectable()
export class LoggerProvider implements LoggerService {
  private logger: Winston.Logger;

  constructor() {
    this.logger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.error.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
        new WinstonDaily({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.combined.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
      ],
    });
  }

  log(message: string, ...optionalParams: unknown[]) {
    this.logger.info(message, optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]) {
    this.logger.error(message, optionalParams);
  }

  warn(message: string, ...optionalParams: unknown[]) {
    this.logger.warn(message, optionalParams);
  }

  debug(message: string, ...optionalParams: unknown[]) {
    this.logger.debug(message, ...optionalParams);
  }
}
