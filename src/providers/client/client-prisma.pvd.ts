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
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new ClientError(
        '[Signup] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNewClient(email: string, encodedPassword: string, passwordToken: string) {
    try {
      const { uuid } = await this.client.create({
        data: {
          email,
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

  async selectUserInfoByMail(email: string, isLogined: number) {
    try {
      const userInfo = await this.client.findFirst({
        select: {
          uuid: true,
          password_token: true,
          password: true,
        },
        where: {
          email,
          is_logined: isLogined,
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

  async updateClientLoginStatus(clientUuid: string, isLogined: number) {
    try {
      const userInfo = await this.client.update({
        data: {
          is_logined: isLogined,
        },
        where: {
          uuid: clientUuid,
        },
      });
      return userInfo;
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

  async getStarredNewsPagination(page: number, size: number, userUuid: string) {
    try {
      const totalPosts = await this.hackers.count({ where: { liked: 1 } });

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

      const geekStarredNews = await this.geek_Liked.findMany({
        select: {
          geek_news: {
            select: {
              uuid: true,
              post: true,
              descLink: true,
              founded: true,
              liked: true,
            },
          },
        },
        where: {
          userUuid,
        },
        take: size,
        skip: (page - 1) * size,
      });

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

      ClientLogger.debug('[STARRED] Founded Starred News: %o', {
        totalPosts,
        hackerNewsSize: hackerStarredNews.length,
        geekNewsSize: geekStarredNews.length,
        mlNewsSize: mlStarredNews.length,
      });

      return {
        totalPosts,
        hackerStarredNews,
        geekStarredNews,
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
}
