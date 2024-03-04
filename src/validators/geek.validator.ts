import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { DailyHadaNewsRequest } from 'types/geek.type';
import { StarRequest } from 'types/request.type';
import { z } from 'zod';

export const geekNewsValidator = async (request: DailyHadaNewsRequest) => {
  try {
    const scheme = z.object({ today: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[GEEK] Geek News Request Validation Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[GEEK] Geek News Request Validator',
      'Geek News Request Validator Failed. Please Check the request',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const geekNewsStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string(), email: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[GEEK] Star Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[GEEK] Star Request Validator',
      'Failed to Star. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const geekNewsUnStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string(), email: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[GEEK] Unstar Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[GEEK] Unstar Request Validator',
      'Failed to Unstar. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
