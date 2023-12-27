import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@nestjs/common';
import { ListRequest, MatchingDataRequest } from 'types/list.type';
import { z } from 'zod';

export const listRequestValidator = async (request: ListRequest) => {
  try {
    const scheme = z.object({ date: z.string() }).strict();

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error(error);

    throw new ValidatorError(
      'List Request Validator',
      'Validation Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const dataRequestValidator = async (request: MatchingDataRequest) => {
  try {
    const scheme = z.object({ today: z.string() }).strict();

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error(error);

    throw new ValidatorError(
      '[News] Get Latest News Request Validator',
      'Validation Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};


export const listValidator = async (request: MatchingDataRequest) => {
  try {
    const scheme = z.object({ today: z.string() }).strict();

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error(error);

    throw new ValidatorError(
      'List Request Validator',
      'Validation Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
