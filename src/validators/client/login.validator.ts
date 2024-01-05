import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { ClientLoginRequest } from 'types/client.type';
import { z } from 'zod';

export const clientLoginValidator = async (request: ClientLoginRequest) => {
  try {
    const scheme = z.object({
      email: z.string(),
      password: z.string(),
    });

    const parsed = await scheme.parseAsync(request);

    return parsed;
  } catch (error) {
    Logger.error('[Client] Login Validator: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[Client] Login Validator',
      'Validate Login Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
