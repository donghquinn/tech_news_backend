import { ClientError, NoUserError } from '@errors/client.error';
import { PasswordError } from '@errors/password.error';
import { comparePassword, decrypt } from '@libraries/client/decrypt.lib';
import { cryptData } from '@libraries/client/encrypt.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { MailerProvider } from 'providers/mailer.pvd';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';
import { AccountManager } from '../auth/account-manager.pvd';
import { ClientPrismaLibrary } from './client-prisma.pvd';

@Injectable()
export class ClientProvider {
  constructor(
    private readonly prisma: ClientPrismaLibrary,
    private readonly accountManager: AccountManager,
    private readonly mailer: MailerProvider,
  ) {}

  async checkEmailandSignup(email: string, password: string, name: string) {
    try {
      await this.prisma.checkIsEmailExist(email);

      // if (result) throw new ClientError('[SIGNUP] Check Exist User Info', 'Found Already Exist User. Reject.');

      ClientLogger.info('[Signup] Start to create user: %o', {
        email,
      });

      const { encodedData: encodedPassword, encodedToken: passwordToken } = cryptData(password);

      const uuid = await this.prisma.insertNewClient(email, name, encodedPassword, passwordToken);

      ClientLogger.info('[Signup] Data Insert Success');

      return uuid;
    } catch (error) {
      ClientLogger.error('[Signup] Singup New User Error: %o', {
        error,
      });

      throw new ClientError(
        '[Signup] Signup New User',
        'Signup New User Error. Please Check request again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async login(email: string, password: string) {
    try {
      const userInfo = await this.prisma.selectUserInfo(email);

      if (userInfo === null) {
        ClientLogger.debug('[LOGIN] No Matching User Found: %o', {
          email,
        });

        throw new ClientError('[LOGIN] Finding Matching User Info', 'No Matching User Found');
      }

      const { password: foundPassword, password_token: passwordToken, uuid } = userInfo;

      const isMatch = comparePassword(password, foundPassword, passwordToken);

      if (!isMatch) {
        ClientLogger.error('[LOGIN] Password Matching Given Password is Not Match. Reject.');

        throw new ClientError('[LOGIN] Password Matching ', ' Password Matching is Not Match. Reject.');
      }

      // Set User Info into REDIS
      const { encodedData: encodedEmail, encodedToken: encodedEmailToken } = cryptData(email);

      ClientLogger.debug('[ACCOUNT] Searching User Info: %o', {
        encodedEmail,
      });

      const isLogined = await this.accountManager.getItem(encodedEmail);

      if (isLogined === null) {
        await this.accountManager.setItem(encodedEmail, encodedEmailToken, uuid, foundPassword);

        ClientLogger.info('[ACCOUNT] Set Finished');

        return encodedEmail;
      }

      ClientLogger.debug('[ACCOUNT] Found User Key: %o', {
        uuid,
      });

      const interval = 1000 * 60 * 60;

      const timer = setIntervalAsync(async () => {
        const isExsit = await this.accountManager.getItem(encodedEmail);

        if (isExsit === null) {
          ClientLogger.info('[ACCOUNT] It is not existing user. Clear Interval.');

          ClientLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
            isExsit,
            uuid,
          });

          clearIntervalAsync(timer);
        } else {
          ClientLogger.info('[ACCOUNT] Expiration time. Delete user.');

          ClientLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
            uuid,
          });

          await this.accountManager.deleteItem(encodedEmail);
        }
      }, interval);

      await this.prisma.updateClientLoginStatus(email, uuid, true);

      return encodedEmail;
    } catch (error) {
      ClientLogger.error('[LOGIN] Login Error: %o', {
        error,
      });

      throw new ClientError(
        '[LOGIN] Login',
        'Login Error. Please try again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async logout(encodedEmail: string) {
    try {
      const foundKey = await this.accountManager.getItem(encodedEmail);

      if (foundKey === null) {
        ClientLogger.debug('[LOGIN] No Matching User Found: %o', {
          encodedEmail,
        });

        throw new ClientError('[LOGIN] Finding Matching User Info', 'No Matching User Found');
      }

      const { token, uuid } = foundKey;

      const email = decrypt(encodedEmail, token);

      await this.prisma.updateClientLoginStatus(email, uuid, false);

      const deleteItem = await this.accountManager.deleteItem(encodedEmail);

      if (deleteItem === null) throw new ClientError('[LOGOUT] Logout', 'No Data Found. Ignore.');

      return 'Logout';
    } catch (error) {
      ClientLogger.error('[LOGIN] Login Error: %o', {
        error,
      });

      throw new ClientError(
        '[LOGIN] Logout',
        'Logout Error. Please try again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async myPage(encodedEmail: string) {
    try {
      const foundKey = await this.accountManager.getItem(encodedEmail);

      if (foundKey === null) {
        ClientLogger.debug('[MYPAGE] No Matching User Found: %o', {
          encodedEmail,
        });

        throw new ClientError('[MYPAGE] Finding Matching User Info', 'No Matching User Found');
      }

      ClientLogger.debug('[MYPAGE] Found Key Item: %o', {
        encodedEmail,
        foundKey,
      });

      const { token, uuid } = foundKey;
      const email = decrypt(encodedEmail, token);

      const result = await this.prisma.getMyPageInfo(email, uuid);

      ClientLogger.info('[MYPAGE] My Starred News: %o', {
        result,
      });

      return result;
    } catch (error) {
      ClientLogger.error('[MYPAGE] Get My Page Error: %o', {
        error,
      });

      throw new ClientError(
        '[MYPAGE] Get My Page',
        'Get My Page Error. Please try again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async changePassword(encodedEmail: string, password: string, newPassword: string) {
    try {
      const loginInfo = await this.accountManager.getItem(encodedEmail);

      if (loginInfo === null) throw new NoUserError('[CHANGE_PASS] Change Password', 'No User Data Found');

      const { token: redisToken } = loginInfo;

      const email = decrypt(encodedEmail, redisToken);

      // 찾기
      const result = await this.prisma.selectUserInfo(email);

      if (result === null) {
        ClientLogger.error('[CHANGE_PASS] Error. No matching User Found.: %o', {
          email,
        });

        throw new NoUserError('[CHANGE_PASS] Login', 'No Matching Info. Please Make sure you Logged Out Before.');
      }

      const { password: dbPassword, password_token: token, uuid } = result;

      const isMatch = comparePassword(password, dbPassword, token);

      if (!isMatch) throw new PasswordError('[CHANGE_PASS] Changing Password', 'Password Is Not Match');

      const { encodedData: encodedPassword, encodedToken: passwordToken } = cryptData(newPassword);

      await this.prisma.updateNewPassword(uuid, encodedPassword, passwordToken);

      ClientLogger.debug('[CHANGE_PASS] Changing Password Complete');

      return 'success';
    } catch (error) {
      ClientLogger.error('[CHANGE_PASS] Change Password Error: %o', {
        error,
      });

      throw new ClientError(
        '[CHANGE_PASS] Change Password',
        'Change Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
