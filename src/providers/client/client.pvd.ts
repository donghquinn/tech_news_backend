import { ClientError } from '@errors/client.error';
import { comparePassword } from '@libraries/client/decrypt.lib';
import { cryptPassword } from '@libraries/client/encrypt.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { AccountManager } from '../auth/account-manager.pvd';
import { ClientPrismaLibrary } from './client-prisma.pvd';

@Injectable()
export class ClientProvider {
  constructor(
    private readonly prisma: ClientPrismaLibrary,
    private readonly accountManager: AccountManager,
  ) {}

  async checkEmailandSignup(email: string, password: string) {
    try {
      await this.prisma.checkIsEmailExist(email);

      // if (result) throw new ClientError('[SIGNUP] Check Exist User Info', 'Found Already Exist User. Reject.');

      ClientLogger.info('[Signup] Start to create user: %o', {
        email,
      });

      const { encodedPassword, passwordToken } = cryptPassword(password);

      const uuid = await this.prisma.insertNewClient(email, encodedPassword, passwordToken);

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
      const userInfo = await this.prisma.selectUserInfoByMail(email, 0);

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

      this.accountManager.setLoginUser(uuid, email, foundPassword);

      await this.prisma.updateClientLoginStatus(uuid, 1);

      return uuid;
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

  async logout(clientUuid: string) {
    try {
      const foundKey = this.accountManager.searchItem(clientUuid);

      if (foundKey === null) {
        ClientLogger.debug('[LOGIN] No Matching User Found: %o', {
          clientUuid,
        });

        throw new ClientError('[LOGIN] Finding Matching User Info', 'No Matching User Found');
      }

      ClientLogger.debug('[LOGOUT] Found Key Item: %o', {
        clientUuid,
        foundKey,
      });

      await this.prisma.updateClientLoginStatus(clientUuid, 0);

      this.accountManager.deleteItem(clientUuid);

      return 'Logout Success';
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

  async myPage(clientUuid: string, page: number) {
    try {
      const foundKey = this.accountManager.searchItem(clientUuid);

      if (foundKey === null) {
        ClientLogger.debug('[MYPAGE] No Matching User Found: %o', {
          clientUuid,
        });

        throw new ClientError('[MYPAGE] Finding Matching User Info', 'No Matching User Found');
      }

      ClientLogger.debug('[MYPAGE] Found Key Item: %o', {
        clientUuid,
        foundKey,
      });

      const { totalPosts, hackerStarredNews, geekStarredNews, mlStarredNews } =
        await this.prisma.getStarredNewsPagination(page, 10, clientUuid);

      return {
        totalPosts,
        hackerStarredNews,
        geekStarredNews,
        mlStarredNews,
      };
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
}
