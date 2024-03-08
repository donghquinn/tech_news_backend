import { Logger } from '@utils/logger.util';
import { ValidatorError } from 'errors/validator.error';
import {
  SearchChangePasswordRequest,
  SearchEmailRequest,
  SearchPasswordRequest,
  ValidatePasswordKeyRequest,
} from 'types/password.type';
import { z } from 'zod';

export const searchEmailRequestValidator = async (request: SearchEmailRequest) => {
  try {
    const scheme = z.object({ name: z.string().min(1) });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[SEARCH_EMAIL] Search Email Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[SEARCH_EMAIL] Search Email Error',
      'Search Email Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const searchPasswordRequestValidator = async (request: SearchPasswordRequest) => {
  try {
    const scheme = z.object({ email: z.string().email('It should be Email Format'), name: z.string().min(1) });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[SEARCH_PASS] Search Password Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[SEARCH_PASS] Search Password Error',
      'Search Password Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const validatePasswordTempKeyRequestValidator = async (request: ValidatePasswordKeyRequest) => {
  try {
    const scheme = z.object({ tempKey: z.string().min(5) });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[VALIDATE_KEY] Password Searching Key Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[VALIDATE_KEY] Validate Password Searching Key Error',
      'Search Password Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const validateSearchPasswordRequestValidator = async (request: SearchChangePasswordRequest) => {
  try {
    const scheme = z.object({
      email: z.string().email('It should be Email Format'),
      name: z.string().min(1),
      password: z.string().min(5, 'Old Password is Too Short'),
      newPassword: z.string().min(5, 'New Password is Too Short'),
    });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[SEARCH_PASS_CHANGE] Searching Changing Password Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidatorError(
      '[SEARCH_PASS_CHANGE] Searching Changing Password Error',
      'Searching Changing Password Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
