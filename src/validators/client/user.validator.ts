import { Logger } from '@utils/logger.util';
import { ValidatorError } from 'errors/validator.error';
import {
  ClientLoginRequest,
  ClientLogoutRequest,
  ClientMyPageRequest,
  ClientMyPageStarNewsRequest,
  ClientSignupRequest,
} from 'types/client.type';
import { ChangePasswordRequest, ChangeTitleRequest } from 'types/user.type';

import { z } from 'zod';

export const clientSignupValidator = async (request: ClientSignupRequest) => {
  try {
    const scheme = z.object({
      email: z.string().email("It's Not Email Format"),
      password: z.string().min(5, 'Password is Too Short'),
      name: z.string().min(1),
    });

    const parsed = await scheme.parseAsync(request);

    return parsed;
  } catch (error) {
    Logger.error('[Client] Signup Validator: %o', {
      error,
    });

    throw new ValidatorError(
      '[Client] Signup Validator',
      'Validate Signup Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const clientLoginValidator = async (request: ClientLoginRequest) => {
  try {
    const scheme = z.object({
      email: z.string().email("It's Not Email Format"),
      password: z.string().min(5, 'Password is Too Short'),
    });

    const parsed = await scheme.parseAsync(request);

    return parsed;
  } catch (error) {
    Logger.error('[Client] Login Validator: %o', {
      error,
    });

    throw new ValidatorError(
      '[Client] Login Validator',
      'Validate Login Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

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

export const clientMyPageValidator = async (request: ClientMyPageRequest) => {
  try {
    const scheme = z.object({
      email: z.string(),
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

export const clientMyPageStarNewsValidator = async (request: ClientMyPageStarNewsRequest) => {
  try {
    const scheme = z.object({
      uuid: z.string(),
      page: z.number(),
    });

    const parsed = await scheme.parseAsync(request);

    return parsed;
  } catch (error) {
    Logger.error('[Client] My Star News Validator: %o', {
      error,
    });

    throw new ValidatorError(
      '[Client] My Star News',
      'Validate My Star News Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
