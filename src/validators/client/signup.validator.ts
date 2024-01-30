import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { ClientSignupRequest } from 'types/client.type';
import { z } from 'zod';

export const clientSignupValidator = async (request: ClientSignupRequest) => {
  try {
    const scheme = z.object({
      email: z.string(),
      password: z.string(),
    });

    const parsed = await scheme.parseAsync(request);

    return parsed;
  } catch (error) {
    Logger.error('[Client] Signup Validator: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[Client] Signup Validator',
      'Validate Signup Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
