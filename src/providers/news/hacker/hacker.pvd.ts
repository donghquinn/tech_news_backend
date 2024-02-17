import { HackerError } from '@errors/hacker.error';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { AccountManager } from 'providers/auth/account-manager.pvd';
import { HackerPrismaLibrary } from './hacker-prisma.lib';

@Injectable()
export class HackersNewsProvider {
  constructor(
    private readonly prisma: HackerPrismaLibrary,
    private readonly account: AccountManager,
  ) {}

  async getHackerNewsCount() {
    try {
      const count = await this.prisma.hackers.count();

      NewsLogger.info('[Hackers] News Total Count: %o', { count });

      return count;
    } catch (error) {
      NewsLogger.error('[Hackers] Get Hacker News Count Error: %o', {
        error,
      });

      throw new HackerError(
        '[Hackers] Hacker News',
        'Hacker News Count Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringTodayHackerPosts(today: string, page: number, size: number) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toDate();

      const startDate = startOfDay(new Date(yesterday));
      const endDate = endOfDay(new Date(yesterday));

      NewsLogger.info('[Hacker] YesterDay: %o', {
        start: startDate,
        end: endDate,
        page,
        size,
      });

      const result = await this.prisma.bringHackerNews(startDate, endDate, page, size);

      const total = await this.prisma.hackerNewsCount(startDate, endDate, size);

      return { result, total };
    } catch (error) {
      NewsLogger.error('[Hackers] Bring Hacker News Error: %o', {
        error,
      });

      throw new HackerError(
        '[Hackers] Hacker News',
        'Hacker News Bringing Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(postUuid: string, clientUuid: string) {
    try {
      const isLogined = await this.account.getItem(clientUuid);

      if (!isLogined) throw new HackerError('[Hackers] Give Star on the Stars', 'No Logined User Found.');

      const { uuid: likedUuid, isLiked } = await this.prisma.checkHackerNewsIsLiked(postUuid, clientUuid);

      if (isLiked) {
        await this.prisma.updateHackerNewsLikedtoUnliked(likedUuid, postUuid, clientUuid);
      }

      if (!isLiked) {
        await this.prisma.updateHackerNewsLiked(likedUuid, postUuid, clientUuid);
      }

      return true;
    } catch (error) {
      NewsLogger.error('[Hackers] Star Update Error: %o', {
        error,
      });

      throw new HackerError(
        '[Hackers] Give Star on the news',
        'Failed to vie star news. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  // Pagination
  async bringStarredNews(page: number, size: number) {
    try {
      const pageNumber = typeof page === 'number' ? page : Number(page);
      const sizeNumber = typeof size === 'number' ? size : Number(size);

      NewsLogger.info('[Hackers] Request to get Starred Hacker News: %o', {
        pageNumber,
        sizeNumber,
      });

      const tempUserUuid = '123';

      const starredNews = await this.prisma.getStarredHackerNewsPagination(page, size, tempUserUuid);

      return starredNews;
    } catch (error) {
      NewsLogger.error('[Hackers] Get Starred Update Error: %o', {
        error,
      });

      throw new HackerError(
        '[Hackers] Bring Starred Hacker News',
        'Failed to Bring Starred Hacker News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
