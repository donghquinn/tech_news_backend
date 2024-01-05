import { Logger } from '@nestjs/common';
import { SetErrorResponse } from 'dto/response.dto';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line consistent-return
export const globalMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const authKey = request.headers?.key;

  Logger.debug('Request IP: %o', {
    IpAddress: request.ip,
    origin: request.originalUrl,
  });

  if (authKey === process.env.AUTH_KEY) {
    Logger.debug('Auth Key Detected');

    next();
  } else {
    return new SetErrorResponse('No Auth Key Detected');
  }
};
