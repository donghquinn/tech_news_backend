import { HadaError } from '@errors/hada.error';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { AccountManager } from 'providers/auth/account-manager.pvd';
import { HadaNewsReturn } from 'types/geek.type';
import { GeekPrismaLibrary } from './geek-prisma.lib';

@Injectable()
export class GeekProvider {
  private resultNewsArray: Array<HadaNewsReturn>;

  constructor(
    private readonly prisma: GeekPrismaLibrary,
    private readonly account: AccountManager,
  ) {
    this.resultNewsArray = [];
  }

  async getNews(today: string, page: number, size: number) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toDate();

      const startDate = startOfDay(new Date(yesterday));
      const endDate = endOfDay(new Date(yesterday));

      NewsLogger.info('[GEEK] YesterDay: %o', {
        start: startDate,
        end: endDate,
        page,
        size,
      });

      const result = await this.prisma.bringHadaNews(startDate, endDate, page, size);

      for (let i = 0; i <= result.length - 1; i += 1) {
        const isUrlUndefined = result[i].descLink.split('.io/')[1];

        if (isUrlUndefined === 'undefined') {
          NewsLogger.debug('[GEEK] Found Undefiend Desc Card URL: %o', {
            title: result[i].post,
            descUrl: result[i].descLink,
            uuid: result[i].uuid,
            isUrlUndefined,
          });

          NewsLogger.debug('[GEEK] Put Original Link into return array: %o', {
            post: result[i].post,
            uuid: result[i].uuid,
            desc: result[i].descLink,
            originalLink: result[i].link,
          });

          this.resultNewsArray.push({
            post: result[i].post,
            uuid: result[i].uuid,
            descLink: result[i].link,
            founded: result[i].founded,
          });
        } else {
          this.resultNewsArray.push({
            post: result[i].post,
            uuid: result[i].uuid,
            descLink: result[i].descLink,
            founded: result[i].founded,
          });
        }
      }

      const total = await this.prisma.geekNewsCount(startDate, endDate, size);

      NewsLogger.info('[GEEK] Get Total Count: %o', {
        total,
      });

      return { result, total };
    } catch (error) {
      NewsLogger.error('[GEEK] Bring Hada News Error: %o', {
        error,
      });

      throw new HadaError(
        '[GEEK] Bring news',
        'Bring Hada News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(postUuid: string, email: string) {
    try {
      const isLogined = await this.account.getItem(email);

      if (isLogined === null) throw new HadaError('[GEEK] Give Star on the Stars', 'No Logined User Found.');

      const { uuid: clientUuid } = isLogined;
      const { uuid: likedUuid, liked } = await this.prisma.checkHadaNewsIsLiked(postUuid, clientUuid);

      if (liked) {
        await this.prisma.updateHadaNewsLikedtoUnliked(likedUuid, postUuid, clientUuid);
      }

      if (!liked) {
        await this.prisma.updateHadaNewsLiked(likedUuid, postUuid, clientUuid);
      }

      return true;
    } catch (error) {
      NewsLogger.error('[GEEK] Star Update Error: %o', {
        error,
      });

      throw new HadaError(
        '[GEEK] Give Star on the news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews(page: number, size: number) {
    try {
      const pageNumber = typeof page === 'number' ? page : Number(page);
      const sizeNumber = typeof size === 'number' ? size : Number(size);

      NewsLogger.info('[GEEK] Request to get Starred Hacker News');

      const starredNews = await this.prisma.getStarredHadaNewsPagination(pageNumber, sizeNumber);

      NewsLogger.info('[GEEK] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error('[GEEK] Get Starred Update Error: %o', {
        error,
      });

      throw new HadaError(
        '[GEEK] Bring Starred Hacker News',
        'Failed to Bring Starred Hacker News. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
