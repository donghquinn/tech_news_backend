import { HadaError } from '@errors/hada.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class HadaProvider {
  constructor(private readonly prisma: PrismaLibrary) {}

  async getNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      NewsLogger.info('[HadaNews] YesterDay: %o', {
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.hada.findMany({
        select: { uuid: true, post: true, descLink: true, founded: true },
        where: {
          founded: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday)),
          },
        },
        orderBy: { rank: 'desc' },
      });

      return result;
    } catch (error) {
      NewsLogger.error(
        '[Hada] Bring Hada News Error: %o',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );

      throw new HadaError(
        '[HADA] Bring news',
        'Bring Hada News Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string, isStarred: boolean) {
    try {
      if (!isStarred) {
        NewsLogger.info('[HADA] Give Hada News unStar Request: %o', {
          uuid,
        });

        await this.prisma.hada.update({
          data: {
            liked: '0',
          },
          where: {
            uuid,
          },
        });

        NewsLogger.info('[HADA] Unstarred Updated');
      } else {
        NewsLogger.info('[HADA] Give Hacker News Star Request: %o', {
          uuid,
        });

        await this.prisma.hada.update({
          data: {
            liked: '1',
          },
          where: {
            uuid,
          },
        });

        NewsLogger.info('[HADA] Starred Updated');
      }

      return true;
    } catch (error) {
      NewsLogger.error('[HADA] Star Update Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[HADA] Give Star on the news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews() {
    try {
      NewsLogger.info('[HADA] Request to get Starred Hacker News');

      const starredNews = await this.prisma.hada.findMany({
        select: {
          uuid: true,
          post: true,
          link: true,
          founded: true,
        },
        orderBy: {
          founded: 'desc',
        },
        where: {
          liked: '1',
        },
      });

      NewsLogger.info('[HADA] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error('[HADA] Get Starred Update Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[HADA] Bring Starred Hacker News',
        'Failed to Bring Starred Hacker News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
