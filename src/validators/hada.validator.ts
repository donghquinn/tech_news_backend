import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { DailyHadaNewsRequest } from 'types/hada.type';
import { StarRequest } from 'types/request.type';
import { z } from 'zod';

export const hadaNewsValidator = async (request: DailyHadaNewsRequest) => {
  try {
    const scheme = z.object({ today: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[Hada] Hada News Request Validation Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[Hada] Hada News Request Validator',
      'Hada News Request Validator Failed. Please Check the request',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const hadaNewsStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[Hada] Star Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[Hada] Star Request Validator',
      'Failed to Star. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const hadaNewsUnStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string(), isStarred: z.boolean() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[Hada] Unstar Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[Hada] Unstar Request Validator',
      'Failed to Unstar. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
