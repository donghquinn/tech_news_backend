import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { StarRequest } from 'types/request.type';
import { z } from 'zod';

export const starValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string(), isStarred: z.boolean() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[Validator] Star Request Validator Error: %o', {
      error,
    });

    throw new ValidatorError(
      'Star Request Validator',
      'Failed to Star',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
