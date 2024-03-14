import { ClientError, NoUserError } from '@errors/client.error';
import { PasswordError } from '@errors/password.error';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { CryptoProvider } from 'providers/crypto.pvd';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';
import { AccountManager } from '../account-manager.pvd';
import { ClientPrismaLibrary } from './client-prisma.pvd';

@Injectable()
export class ClientProvider {
  constructor(
    private readonly prisma: ClientPrismaLibrary,
    private readonly accountManager: AccountManager,
    private readonly crypto: CryptoProvider,
  ) {}

  async checkEmailandSignup(email: string, password: string, name: string) {
    try {
      await this.prisma.checkIsEmailExist(email);

      // if (result) throw new ClientError('[SIGNUP] Check Exist User Info', 'Found Already Exist User. Reject.');

      ClientLogger.debug('[Signup] Start to create user: %o', {
        email,
      });

      const { encodedData: encodedPassword, encodedToken: passwordToken } = this.crypto.cryptData(password);

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
    const userInfo = await this.prisma.selectUserInfo(email);

    if (userInfo === null) {
      ClientLogger.debug('[LOGIN] No Matching User Found: %o', {
        email,
      });

      throw new ClientError('[LOGIN] Finding Matching User Info', 'No Matching User Found');
    }

    const { password: foundPassword, password_token: passwordToken, uuid } = userInfo;

    const isMatch = this.crypto.comparePassword(password, foundPassword, passwordToken);

    if (!isMatch) {
      ClientLogger.error('[LOGIN] Password Matching Given Password is Not Match. Reject.');

      throw new ClientError('[LOGIN] Password Matching ', ' Password Matching is Not Match. Reject.');
    }

    // Set User Info into REDIS
    const { encodedData: encodedEmail, encodedToken: encodedEmailToken } = this.crypto.cryptData(email);

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
  }

  async logout(encodedEmail: string) {
    const foundKey = await this.accountManager.getItem(encodedEmail);

    if (foundKey === false) {
      ClientLogger.debug('[LOGIN] No Matching User Found: %o', {
        encodedEmail,
      });

      throw new ClientError('[LOGIN] Finding Matching User Info', 'No Matching User Found');
    }

    const { token, uuid } = foundKey;

    const email = this.crypto.decrypt(encodedEmail, token);

    await this.prisma.updateClientLoginStatus(email, uuid, false);

    const deleteItem = await this.accountManager.deleteItem(encodedEmail);

    if (deleteItem === false) throw new ClientError('[LOGOUT] Logout', 'No Data Found. Ignore.');

    return 'Logout';
  }

  async myPage(encodedEmail: string) {
    const foundKey = await this.accountManager.getItem(encodedEmail);

    if (foundKey === false) {
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
    const email = this.crypto.decrypt(encodedEmail, token);

    const result = await this.prisma.getMyPageInfo(email, uuid);

    ClientLogger.info('[MYPAGE] Got My Starred News');

    return result;
  }

  async changePassword(encodedEmail: string, password: string, newPassword: string) {
    const loginInfo = await this.accountManager.getItem(encodedEmail);

    if (loginInfo === false) throw new NoUserError('[CHANGE_PASS] Change Password', 'No User Data Found');

    const { token: redisToken } = loginInfo;

    const email = this.crypto.decrypt(encodedEmail, redisToken);

    // 찾기
    const result = await this.prisma.selectUserInfo(email);

    if (result === null) {
      ClientLogger.error('[CHANGE_PASS] Error. No matching User Found.: %o', {
        email,
      });

      throw new NoUserError('[CHANGE_PASS] Login', 'No Matching Info. Please Make sure you Logged Out Before.');
    }

    const { password: dbPassword, password_token: token, uuid } = result;

    const isMatch = this.crypto.comparePassword(password, dbPassword, token);

    if (!isMatch) throw new PasswordError('[CHANGE_PASS] Changing Password', 'Password Is Not Match');

    const { encodedData: encodedPassword, encodedToken: passwordToken } = this.crypto.cryptData(newPassword);

    await this.prisma.updateNewPassword(uuid, encodedPassword, passwordToken);

    ClientLogger.info('[CHANGE_PASS] Changing Password Complete');

    return 'success';
  }
}
