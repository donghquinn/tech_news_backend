import { HackerError } from '@errors/hacker.error';
import { PrismaError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class HackerPrismaLibrary extends PrismaClient {
  async bringHackerNews(startDate: Date, endDate: Date) {
    try {
      const result = await this.hackers.findMany({
        select: { uuid: true, post: true, link: true, founded: true, liked: true },
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { rank: 'desc' },
      });

      return result;
    } catch (error) {
      NewsLogger.error('[ML] Bring Geek News Error: %o', {
        error,
      });

      throw new PrismaError(
        '[ML] Bring Geek News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async checkHackerNewsIsLiked(uuid: string) {
    try {
      const isStarred = await this.hackers.findFirst({
        select: {
          liked: true,
        },
        where: {
          uuid,
        },
      });

      if (isStarred === null) throw new HackerError('[Hacker] Get Star Info', 'No Star Info Found.');

      NewsLogger.info('[Hacker] Found Is Starred Info: %o', {
        isLiked: isStarred?.liked,
      });

      return isStarred.liked;
    } catch (error) {
      NewsLogger.error('[Hacker] Check Hada News Liked Info Error: %o', {
        error,
      });

      throw new HackerError(
        '[Hacker] Check Hada News Liked Info',
        'Check Hada News Liked Info Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateHackerNewsLikedtoUnliked(uuid: string) {
    try {
      NewsLogger.info('[Hacker] Give Hada News unStar Request: %o', {
        uuid,
      });

      await this.hackers.update({
        data: {
          liked: 0,
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[Hacker] Unstarred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[Hacker] Update Liked to UnLiked Error: %o', {
        error,
      });

      throw new HackerError(
        '[Hacker] Update Liked to UnLiked',
        'Update Liked to UnLiked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateHackerNewsLiked(uuid: string) {
    try {
      NewsLogger.info('[Hacker] Give Hacker News Star Request: %o', {
        uuid,
      });

      await this.hackers.update({
        data: {
          liked: 1,
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[Hacker] Starred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[Hacker] Update News Liked Error: %o', {
        error,
      });

      throw new HackerError(
        '[Hacker] Update News Liked',
        'Update News Liked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getStarredHackerNewsPagination(page: number, size: number, userUuid: string) {
    try {
      const totalPosts = await this.hackers.count({ where: { liked: 1 } });

      const starredNews = await this.hacker_Liked.findMany( {
        select: {
          hacker_news: {
            select: {
              uuid: true,
              post: true,
              link: true,
              founded: true,
            }
          }
        }, where: {
          userUuid,
        },
        take: size,
        skip: (page - 1) * size,
      })
      // const starredNews = await this.hackers.findMany({
      //   select: {
      //     uuid: true,
      //     post: true,
      //     link: true,
      //     founded: true,
      //   },
      //   orderBy: {
      //     founded: 'desc',
      //   },
      //   where: {
      //     liked: 1,
      //   },
      //   take: size,
      //   skip: (page - 1) * size,
      // });

      NewsLogger.info('[Hacker] Founded Starred News: %o', {
        totalPosts,
        newsSize: starredNews.length,
      });

      return {
        totalPosts,
        starredNews,
      };
    } catch (error) {
      NewsLogger.info('[Hacker] Get Starred News Error: %o', {
        error,
      });

      throw new HackerError(
        '[Hacker] Get Starred News',
        'Get Starred News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
