import { HackerError } from '@errors/hacker.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class HackersNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getHackerNewsCount() {
    try {
      const count = await this.prisma.hackers.count();

      NewsLogger.info('[Hackers] News Total Count: %o', { count });

      return count;
    } catch (error) {
      NewsLogger.error('[Hackers] Get Hacker News Count Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HackerError(
        '[Hackers] Hacker News',
        'Hacker News Count Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringTodayHackerPosts(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      NewsLogger.info('[Hackers] YesterDay: %o', {
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.hackers.findMany({
        select: { uuid: true, post: true, link: true, founded: true, liked: true },
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
        '[Hackers] Bring Hacker News Error: %o',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );

      throw new HackerError(
        '[Hackers] Hacker News',
        'Hacker News Bringing Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string) {
    try {
      const isStarred = await this.prisma.hackers.findFirst({
        select: {
          liked: true,
        },
        where: {
          uuid,
        },
      });

      if (isStarred === null) throw new HackerError('[Hacker] Get Star Info', 'No Star Info Found.');

      if (isStarred.liked) {
        NewsLogger.info('Give Hacker News unStar Request: %o', {
          uuid,
        });

        await this.prisma.hackers.update({
          data: {
            liked: 0,
          },
          where: {
            uuid,
          },
        });

        NewsLogger.info('[Hackers] Unstarred Updated');
      } else {
        NewsLogger.info('[Hackers] Give Hacker News Star Request: %o', {
          uuid,
        });

        await this.prisma.hackers.update({
          data: {
            liked: 1,
          },
          where: {
            uuid,
          },
        });

        NewsLogger.info('[Hackers] Starred Updated');
      }

      return true;
    } catch (error) {
      NewsLogger.error('[Hackers] Star Update Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HackerError(
        '[Hackers] Give Star on the news',
        'Failed to vie star news. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews() {
    try {
      NewsLogger.info('[Hackers] Request to get Starred Hacker News');

      const starredNews = await this.prisma.hackers.findMany({
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
          liked: 1,
        },
      });

      NewsLogger.info('[Hackers] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error('[Hackers] Get Starred Update Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HackerError(
        '[Hackers] Bring Starred Hacker News',
        'Failed to Bring Starred Hacker News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
