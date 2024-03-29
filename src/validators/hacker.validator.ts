import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { DailyHackerNewsRequest } from 'types/hackers.type';
import { StarRequest } from 'types/request.type';
import { z } from 'zod';

export const hackerNewsValidator = async (request: DailyHackerNewsRequest) => {
  try {
    const scheme = z.object({ today: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[Hacker] Hacker News Request Validation Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[Hacker] Hacker News Request Validator',
      'Hacker News Request Validator Failed',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const hackerNewsStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string(), email: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[Hacker] Star Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[Hacker] Star Request Validator',
      'Failed to Star. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const hackerNewsUnStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string(), email: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[Hacker] Unstar Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[Hacker] Unstar Request Validator',
      'Failed to Unstar. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
