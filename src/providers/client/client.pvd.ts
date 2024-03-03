import { ClientError } from '@errors/client.error';
import { comparePassword, decrypt } from '@libraries/client/decrypt.lib';
import { cryptData } from '@libraries/client/encrypt.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';
import { HadaNewsReturn } from 'types/geek.type';
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

      const { encodedData: encodedPassword, encodedToken: passwordToken } = cryptData(password);

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
      const userInfo = await this.prisma.selectUserInfoByMail(email);

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
        await this.accountManager.setItem(encodedEmail, encodedEmailToken, uuid, password);

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

      await this.prisma.updateClientLoginStatus(email, uuid, 1);

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

      await this.prisma.updateClientLoginStatus(email, uuid, 0);

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

  async myStarredMlNews(clientUuid: string, page: number) {
    try {
      const foundKey = await this.accountManager.getItem(clientUuid);

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

      const { totalPosts, mlStarredNews } = await this.prisma.getStarredMlNewsPagination(page, 10, clientUuid);

      const mlNews = mlStarredNews.map((item) => item.ml_news);

      return {
        totalPosts,
        mlNews,
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

  async myStarredHackerNews(clientUuid: string, page: number) {
    try {
      const foundKey = await this.accountManager.getItem(clientUuid);

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

      const { totalPosts, hackerStarredNews } = await this.prisma.getStarredHackerNewsPagination(page, 10, clientUuid);

      const hackerNews = hackerStarredNews.map((item) => item.hacker_news);

      return {
        totalPosts,
        hackerNews,
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

  async myStarredGeekNews(clientUuid: string, page: number) {
    try {
      const foundKey = await this.accountManager.getItem(clientUuid);
      const resultNewsArray: Array<HadaNewsReturn> = [];

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

      const { totalPosts, geekStarredNews } = await this.prisma.getStarredGeekNewsPagination(page, 10, clientUuid);

      for (let i = 0; i <= geekStarredNews.length - 1; i += 1) {
        const { post, descLink, uuid, link, founded } = geekStarredNews[i].geek_news;

        const isUrlUndefined = descLink.split('.io/')[1];

        if (isUrlUndefined === 'undefined') {
          ClientLogger.debug('[GEEK] Found Undefiend Desc Card URL: %o', {
            title: post,
            descUrl: descLink,
            uuid,
            isUrlUndefined,
          });

          ClientLogger.debug('[GEEK] Put Original Link into return array: %o', {
            post,
            uuid,
            desc: descLink,
            originalLink: link,
          });

          resultNewsArray.push({
            post,
            uuid,
            descLink: link,
            founded,
          });
        } else {
          resultNewsArray.push({
            post,
            uuid,
            descLink,
            founded,
          });
        }
      }

      return {
        totalPosts,
        resultNewsArray,
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
