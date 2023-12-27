import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { ScrapeRequest, StarRequest } from 'types/request.type';
import { z } from 'zod';

export const naverNewsValidator = async (request: ScrapeRequest) => {
  try {
    const scheme = z.object({ today: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch ( error )
  {
    Logger.error( "[Naver] Naver News Request Validation Error: %o", {
      error: error instanceof Error ? error : new Error( JSON.stringify( error ) ),
    } );

    throw new ValidatorError(
      '[Naver] News Request Validator',
      'Naver News Request Validator Failed',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const naverNewsStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string(), isStarred: z.boolean() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[Naver] Star Request Validator Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[Naver] Star Request Validator',
      'Failed to Star. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};