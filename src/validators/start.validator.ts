import { ValidatorError } from '@errors/validator.error';
import { StarRequest } from 'types/request.type';
import { z } from 'zod';

export const starValidator = async (request: StarRequest) => {
  try {
    const scheme = z.object({ uuid: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    throw new ValidatorError(
      'Star Request Validator',
      'Failed to Star',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
