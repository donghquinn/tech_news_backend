import { Logger } from '@utils/logger.util';
import { ValidatorError } from 'errors/validator.error';
import { ChangePasswordRequest, ChangeTitleRequest } from 'types/user.type';

import { z } from 'zod';

export const changePasswordValidator = async (request: ChangePasswordRequest) => {
  try {
    const scheme = z.object({
      email: z.string().email(),
      password: z.string().min(5, 'Old Password is Too Short'),
      newPassword: z.string().min(5, 'New Password is Too Short'),
    });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[PASSWORD] Change Password Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[PASSWORD] Change Password Error',
      'Change Password Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const changeTitleValidator = async (request: ChangeTitleRequest) => {
  try {
    const scheme = z.object({ email: z.string(), title: z.string() });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[TITLE] Change Title Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[PASSWORD] Change Title Error',
      'Change Title Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
