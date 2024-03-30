import { ClientError } from '@errors/client.error';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { AccountManager } from 'providers/account-manager.pvd';
import { GeekNewsReturn } from 'types/geek.type';
import { ClientPrismaLibrary } from './client-prisma.pvd';

@Injectable()
export class ClientStarProvider {
  constructor(
    private readonly accountManager: AccountManager,
    private readonly prisma: ClientPrismaLibrary,
  ) {}

  async myStarredMlNews(clientUuid: string, page: number) {
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
  }

  async myStarredHackerNews(clientUuid: string, page: number) {
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
  }

  async myStarredGeekNews(clientUuid: string, page: number) {
    const foundKey = await this.accountManager.getItem(clientUuid);
    const resultNewsArray: Array<GeekNewsReturn> = [];

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
  }
}
