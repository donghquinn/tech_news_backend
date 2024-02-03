import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { ClientMyPageRequest } from 'types/client.type';
import { z } from 'zod';

export const clientMyPageValidator = async (request: ClientMyPageRequest) => {
  try {
    const scheme = z.object({
      uuid: z.string(),
    });

    const parsed = await scheme.parseAsync(request);

    return parsed;
  } catch (error) {
    Logger.error('[Client] My Page Validator: %o', {
      error,
    });

    throw new ValidatorError(
      '[Client] My Page Validator',
      'Validate My Page Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
