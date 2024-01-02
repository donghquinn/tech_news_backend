import { HackerError } from '@errors/hacker.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import {
  bringHackerNews,
  checkHackerNewsIsLiked,
  updateHackerNewsLiked,
  updateHackerNewsLikedtoUnliked,
} from '@libraries/news/hacker.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';

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
      const result = await bringHackerNews(this.prisma, today);

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
      const isLiked = await checkHackerNewsIsLiked(this.prisma, uuid);

      if (isLiked) {
        await updateHackerNewsLikedtoUnliked(this.prisma, uuid);
      }

      if (!isLiked) {
        await updateHackerNewsLiked(this.prisma, uuid);
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
