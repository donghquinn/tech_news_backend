import { ClientError } from '@errors/client.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientLogger } from '@utils/logger.util';

@Injectable()
export class ClientPrismaLibrary extends PrismaClient {
  async checkIsEmailExist(email: string) {
    try {
      const result = await this.client.findFirst({
        select: {
          uuid: true,
        },
        where: { email },
      });

      if (result !== null)
        throw new ClientError('[Signup] Check is Exist in Email', 'Found Existing Email. Please try different email');

      ClientLogger.debug('[Signup] No Email Found. Good to go: %o', {
        email,
      });

      // return true;
    } catch (error) {
      ClientLogger.error('[Signup] Check is existing email: %o', {
        error,
      });

      throw new ClientError(
        '[Signup] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNewClient(email: string, name: string, encodedPassword: string, passwordToken: string) {
    try {
      const { uuid } = await this.client.create({
        data: {
          email,
          name,
          password: encodedPassword,
          password_token: passwordToken,
        },
      });

      return uuid;
    } catch (error) {
      ClientLogger.error('[Signup] Check is existing email: %o', {
        error,
      });

      throw new ClientError(
        '[Signup] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async selectUserInfo(email: string, name?: string) {
    try {
      const userInfo = await this.client.findFirst({
        select: {
          uuid: true,
          password_token: true,
          password: true,
        },
        where: {
          email,
          name,
        },
      });

      return userInfo;
    } catch (error) {
      ClientLogger.error('[Signup] Check is existing email: %o', {
        error,
      });

      throw new ClientError(
        '[Signup] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async selectUserInfoByUuid(clientUuid: string) {
    try {
      const userInfo = await this.client.findFirst({
        select: {
          uuid: true,
          password_token: true,
          password: true,
        },
        where: {
          uuid: clientUuid,
        },
      });
      return userInfo;
    } catch (error) {
      ClientLogger.error('[LOGOUT] Check is existing email: %o', {
        error,
      });

      throw new ClientError(
        '[LOGOUT] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateClientLoginStatus(email: string, clientUuid: string, isLogined: boolean) {
    try {
      await this.client.update({
        data: {
          is_logined: isLogined,
        },
        where: {
          email,
          uuid: clientUuid,
        },
      });
    } catch (error) {
      ClientLogger.error('[STATUS] User Status Update: %o', {
        error,
      });

      throw new ClientError(
        '[STATUS] User Status Update',
        'User Status Update Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getMyPageInfo(email: string, clientUuid: string) {
    try {
      const result = await this.client.findFirst({
        select: {
          liked_ml_posts: {
            select: {
              postUuid: true,
              ml_news: {
                select: {
                  uuid: true,
                  title: true,
                  link: true,
                  founded: true,
                },
              },
            },
          },

          liked_geek_posts: {
            select: {
              geek_news: {
                select: {
                  uuid: true,
                  post: true,
                  link: true,
                  descLink: true,
                  founded: true,
                },
              },
            },
          },

          liked_hacker_posts: {
            select: {
              hacker_news: {
                select: {
                  uuid: true,
                  post: true,
                  link: true,
                  founded: true,
                },
              },
            },
          },
        },
        where: {
          email,
          uuid: clientUuid,
        },
      });

      if (result === null) throw new ClientError('[MYPAGE] Get My Page', 'No User Found');

      return result;
    } catch (error) {
      throw new ClientError('[MYPAGE] Get My Page', 'Get My Page Error.');
    }
  }

  async getStarredHackerNewsPagination(page: number, size: number, userUuid: string) {
    try {
      const hackerStarredNews = await this.hacker_Liked.findMany({
        select: {
          hacker_news: {
            select: {
              uuid: true,
              post: true,
              link: true,
              founded: true,
            },
          },
        },
        where: {
          userUuid,
        },
        take: size,
        skip: (page - 1) * size,
      });

      const totalPosts = hackerStarredNews.length;

      ClientLogger.debug('[STARRED] Founded Starred News: %o', {
        totalPosts,
        hackerNewsSize: hackerStarredNews.length,
      });

      return {
        totalPosts,
        hackerStarredNews,
      };
    } catch (error) {
      ClientLogger.info('[STARRED] Get Starred News Error: %o', {
        error,
      });

      throw new ClientError(
        '[STARRED] Get Starred News',
        'Get Starred News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getStarredGeekNewsPagination(page: number, size: number, userUuid: string) {
    try {
      const geekStarredNews = await this.geek_Liked.findMany({
        select: {
          geek_news: {
            select: {
              uuid: true,
              post: true,
              descLink: true,
              founded: true,
              link: true,
            },
          },
        },
        where: {
          userUuid,
        },
        take: size,
        skip: (page - 1) * size,
      });

      const totalPosts = geekStarredNews.length;
      ClientLogger.debug('[STARRED] Founded Starred News: %o', {
        totalPosts,
        geekNewsSize: geekStarredNews.length,
      });

      return {
        totalPosts,
        geekStarredNews,
      };
    } catch (error) {
      ClientLogger.info('[STARRED] Get Starred News Error: %o', {
        error,
      });

      throw new ClientError(
        '[STARRED] Get Starred News',
        'Get Starred News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getStarredMlNewsPagination(page: number, size: number, userUuid: string) {
    try {
      const mlStarredNews = await this.ml_Liked.findMany({
        select: {
          ml_news: {
            select: {
              uuid: true,
              category: true,
              title: true,
              link: true,
              founded: true,
            },
          },
        },
        where: {
          userUuid,
        },
        take: size,
        skip: (page - 1) * size,
      });

      const totalPosts = mlStarredNews.length;

      ClientLogger.debug('[STARRED] Founded Starred News: %o', {
        totalPosts,
        mlNewsSize: mlStarredNews.length,
      });

      return {
        totalPosts,
        mlStarredNews,
      };
    } catch (error) {
      ClientLogger.info('[STARRED] Get Starred News Error: %o', {
        error,
      });

      throw new ClientError(
        '[STARRED] Get Starred News',
        'Get Starred News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async findEmail(name: string) {
    try {
      const result = await this.client.findFirst({
        select: {
          email: true,
        },
        where: {
          name,
        },
      });

      return result;
    } catch (error) {
      ClientLogger.error('[CHANGE_PASS] Update New Password Error: %o', {
        error,
      });

      throw new ClientError(
        '[CHANGE_PASS] Update New Password',
        'Update New Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateNewPassword(userUuid: string, newEncodedPassword: string, newEncodedToken: string) {
    try {
      await this.client.update({
        data: {
          password: newEncodedPassword,
          password_token: newEncodedToken,
        },
        where: {
          uuid: userUuid,
        },
      });
    } catch (error) {
      ClientLogger.error('[CHANGE_PASS] Update New Password Error: %o', {
        error,
      });

      throw new ClientError(
        '[CHANGE_PASS] Update New Password',
        'Update New Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async findUser(email: string, name?: string) {
    try {
      const result = await this.client.findFirst({
        where: { email, name },
        select: { uuid: true, password: true, password_token: true },
      });

      return result;
    } catch (error) {
      ClientLogger.error('[LOGOUT] Find User Error: %o', {
        error,
      });

      throw new ClientError(
        '[LOGOUT] Find User',
        'Find User Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
