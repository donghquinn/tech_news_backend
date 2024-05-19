import { jwtValid } from '@utils/auth/auth.util';
import { Logger } from '@utils/logger.util';
import { NextFunction, Response, Request } from 'express';

export const jwtAuthMiddlewares = (request: Request, response: Response, next: NextFunction) => {
  try {
    const token = request.headers.authorization?.split('Bearer ')[0];

    if (token === undefined) return response.status(500).json({ error: 'JWT Token is not included' });

    const { userId, userType } = jwtValid(token);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.body.decoded = { userId, userType };

    return next();
  } catch (error) {
    Logger.error('[AUTH] Validate JWT Error: %o', error);

    throw new Error('JWT Validate Error');
  }
};
