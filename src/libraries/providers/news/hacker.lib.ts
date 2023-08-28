import { HackerError } from '@errors/hacker.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable, Logger } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class HackersNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getHackerNewsCount() {
    try {
      const count = await this.prisma.hackers.count();

      Logger.log('Hacker News Total Count: %o', { count });

      return count;
    } catch (error) {
      Logger.error('Get Hacker News Count Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HackerError(
        'Hacker News',
        'Hacker News Count Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringTodayHackerPosts(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      Logger.debug('Hacker YesterDay: %o', {
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.hackers.findMany({
        select: { uuid: true, post: true, link: true, founded: true },
        where: {
          founded: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday)),
          },
        },
        orderBy: { rank: 'desc' },
      });

      await this.prisma.onModuleDestroy();

      return result;
    } catch (error) {
      Logger.error('Bring Hacker News Error: %o', error instanceof Error ? error : new Error(JSON.stringify(error)));

      throw new HackerError(
        'Hacker News',
        'Hacker News Bringing Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string) {
    try {
      Logger.debug('Give Hacker News Star Request: %o', {
        uuid,
      });

      await this.prisma.hackers.update({
        data: {
          starred: '1',
        },
        where: {
          uuid,
        },
      });

      await this.prisma.onModuleDestroy();

      Logger.log('Starred Updated');

      return true;
    } catch (error) {
      throw new HackerError(
        'Give Star on the news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async unStar(uuid: string) {
    try {
      Logger.debug('Give Hacker News unStar Request: %o', {
        uuid,
      });

      await this.prisma.hackers.update({
        data: {
          starred: '0',
        },
        where: {
          uuid,
        },
      });

      await this.prisma.onModuleDestroy();

      Logger.log('Starred Updated');

      return true;
    } catch (error) {
      throw new HackerError(
        'unStar on the news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews() {
    try {
      Logger.log('Request to get Starred Hacker News');

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
          starred: '1',
        },
      });

      await this.prisma.onModuleDestroy();

      Logger.log('Founded Starred News');

      return starredNews;
    } catch (error) {
      throw new HackerError(
        'Bring Starred Hacker News',
        'Failed to Bring Starred Hacker News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
