import { HackerError } from '@errors/hacker.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import {
  bringHackerNews,
  checkHackerNewsIsLiked,
  updateHackerNewsLiked,
  updateHackerNewsLikedtoUnliked,
} from '@libraries/news/hacker.lib';
import { getStarredNewsPagination } from '@libraries/news/hada.lib';
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
        error:  error instanceof Error ? error : new Error(JSON.stringify(error)),
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
        '[Hackers] Bring Hacker News Error: %o', {
          error:  error instanceof Error ? error : new Error(JSON.stringify(error)),
        }
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
        error:  error instanceof Error ? error : new Error(JSON.stringify(error)),
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
    try
    {
      const pageNumber = typeof page === "number" ? page : Number( page );
      const sizeNumber = typeof size === "number" ? size : Number( size );

      NewsLogger.info( '[Hackers] Request to get Starred Hacker News: %o', {
        pageNumber,
        sizeNumber,
      });

      const tempUserUuid = "123";

      const starredNews = await getStarredNewsPagination( this.prisma, page, size, tempUserUuid );

      return starredNews;
    } catch (error) {
      NewsLogger.error('[Hackers] Get Starred Update Error: %o', {
        error:  error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HackerError(
        '[Hackers] Bring Starred Hacker News',
        'Failed to Bring Starred Hacker News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
