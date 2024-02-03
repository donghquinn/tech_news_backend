import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { NextFunction, Request } from 'express';

// eslint-disable-next-line consistent-return
export const globalMiddleware = (request: Request, res: Response, next: NextFunction): void => {
  const authKey = request.headers?.key;

  Logger.debug('Request IP: %o', {
    IpAddress: request.ip,
    origin: request.originalUrl,
  });

  if (authKey === process.env.AUTH_KEY) {
    Logger.debug('Auth Key Detected');

    next();
  } else {
    throw new HttpException('Authorize Key Not Match', HttpStatus.BAD_REQUEST);
  }
};
