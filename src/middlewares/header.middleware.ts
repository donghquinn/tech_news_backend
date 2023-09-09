import { Logger } from '@nestjs/common';
import { SetErrorResponse } from 'dto/response.dto';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line consistent-return
export const HeaderAuthMiddleware = (request: Request, response: Response, next: NextFunction) => {
  try {
    const authKey = request.headers?.key;

    Logger.debug(request.ip);

    if (authKey === process.env.AUTH_KEY) {
      Logger.debug('Auth Key Detected');

      next();
    } else {
      return new SetErrorResponse(500, { response: 'No Auth Key Detected' });
    }
  } catch (error) {
    return new SetErrorResponse(500, { response: 'Middleware Error' });
  }

  // return new SetErrorResponse(500, { response: 'Something Else Error' });
};

// @Injectable()
// export class HeadersMiddleware implements NestMiddleware {
//   // eslint-disable-next-line @typescript-eslint/require-await, class-methods-use-this, consistent-return
//   use(request: Request, response: Response, next: NextFunction) {
//     try {
//       const authKey = request.headers?.key;

//       Logger.debug(request.ip);

//       if (authKey === process.env.AUTH_KEY) {
//         Logger.debug('Auth Key Detected');

//         next();
//       } else {
//         return new SetErrorResponse(500, { response: 'No Auth Key Detected' });
//       }
//     } catch (error) {
//       return new SetErrorResponse(500, { response: 'Middleware Error' });
//     }
//   }
// }
