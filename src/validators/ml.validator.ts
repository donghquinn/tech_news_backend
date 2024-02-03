import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { DailyMlNewsRequest } from 'types/ml.type';
import { StarRequest } from 'types/request.type';
import { z } from 'zod';

export const machineLearningValidator = async (request: DailyMlNewsRequest) => {
  try {
    const scheme = z.object({ today: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[ML] MachineLearning News Request Validation Error: %o', {
      error,
    });

    throw new ValidatorError(
      'MachineLearning News Request Validator',
      'MachineLearning News Request Validator Failed',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const mlNewsStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[ML] Star Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[ML] Star Request Validator',
      'Failed to Star. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const mlNewsUnStarValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string(), isStarred: z.boolean() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[ML] Unstar Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      '[ML] Unstar Request Validator',
      'Failed to Unstar. Please Check the request Body.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
