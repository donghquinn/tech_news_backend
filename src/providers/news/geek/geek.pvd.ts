/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { GeekError } from '@errors/news.error';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { AccountManager } from 'providers/account-manager.pvd';
import { GeekNewsReturn } from 'types/geek.type';
import { GeekPrismaLibrary } from './geek-prisma.lib';

@Injectable()
export class GeekProvider {
  constructor(
    private readonly prisma: GeekPrismaLibrary,
    private readonly account: AccountManager,
  ) {}

  async getNews(today: string, page: number, size: number) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toDate();

      const startDate = startOfDay(new Date(yesterday));
      const endDate = endOfDay(new Date(yesterday));

      NewsLogger.debug('[GEEK] YesterDay: %o', {
        start: startDate,
        end: endDate,
        page,
        size,
      });

      const result = await this.prisma.bringGeekNews(startDate, endDate, page, size);

      const returnData: Array<GeekNewsReturn> = result.map((item) => {
        const isUrlUndefined = item.descLink.split('.io/')[1];

        const { post, descLink, uuid, link, _count, founded } = item;
        const { liked_model: likedCount } = _count;

        if (isUrlUndefined === 'undefined')
          return {
            post,
            uuid,
            descLink: link,
            founded,
            likedCount,
          };

        return {
          post,
          uuid,
          descLink,
          founded,
          likedCount,
        };
      });

      const total = await this.prisma.geekNewsCount(startDate, endDate, size);

      NewsLogger.info('[GEEK] Get Total Count: %o', {
        total,
      });

      return { result: returnData, total };
    } catch (error) {
      NewsLogger.error('[GEEK] Bring Hada News Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Bring news',
        'Bring Hada News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(postUuid: string, email: string): Promise<void> {
    try {
      const isLogined = await this.account.getItem(email);

      if (isLogined === null) throw new GeekError('[GEEK] Give Star on the Stars', 'No Logined User Found.');

      const { uuid: clientUuid } = isLogined;

      const isStarred = await this.prisma.checkGeekNewsIsLiked(postUuid, clientUuid);
      const { geek_news: isLiked } = isStarred;

      if (isLiked === undefined) await this.prisma.createGeekNewsLiked(postUuid, clientUuid);
    } catch (error) {
      NewsLogger.error('[GEEK] Star Update Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Give Star on the news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async unStar(postUuid: string, email: string): Promise<void> {
    try {
      const isLogined = await this.account.getItem(email);

      if (isLogined === null) throw new GeekError('[GEEK] Give Star on the Stars', 'No Logined User Found.');

      const { uuid: clientUuid } = isLogined;
      const isStarred = await this.prisma.checkGeekNewsIsLiked(postUuid, clientUuid);

      const { geek_news: isLiked } = isStarred;

      const { uuid: likedUuid } = isLiked;
      if (likedUuid) await this.prisma.deleteGeekNewsLiked(likedUuid, postUuid, clientUuid);

      NewsLogger.info('[GEEK] Finished UnStar Geek News');
    } catch (error) {
      NewsLogger.error('[GEEK] Finished UnStar Geek News Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Finished UnStar Geek News',
        'Failed to Finished UnStar Geek News. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
