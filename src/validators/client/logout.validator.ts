import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { ClientLogoutRequest } from 'types/client.type';
import { z } from 'zod';

export const clientLogoutValidator = async (request: ClientLogoutRequest) => {
  try {
    const scheme = z.object({
      email: z.string(),
    });

    const parsed = await scheme.parseAsync(request);

    return parsed;
  } catch (error) {
    Logger.error('[Client] Logout Validator: %o', {
      error,
    });

    throw new ValidatorError(
      '[Client] Logout Validator',
      'Validate Logout Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
