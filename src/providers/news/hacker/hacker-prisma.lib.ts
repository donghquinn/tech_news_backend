import { HackerError } from '@errors/hacker.error';
import { PrismaError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class HackerPrismaLibrary extends PrismaClient {
  async bringHackerNews(startDate: Date, endDate: Date, page: number, size: number) {
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
        take: Number(size),
        skip: (Number(page) - 1) * Number(size),
      });

      const totalCounts = await this.hackers.count({
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return { result, total: Math.ceil(totalCounts / size) };
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

  async checkHackerNewsIsLiked(postUuid: string, clientUuid: string) {
    try {
      const isStarred = await this.hacker_Liked.findFirst({
        select: {
          uuid: true,
          hacker_news: {
            select: {
              liked: true,
            },
          },
        },
        where: {
          userUuid: clientUuid,
          postUuid,
        },
      });

      if (isStarred === null) throw new HackerError('[Hacker] Get Star Info', 'No Star Info Found.');

      NewsLogger.debug('[Hacker] Found Is Starred Info: %o', {
        isLiked: isStarred.hacker_news.liked,
      });

      return { uuid: isStarred.uuid, isLiked: isStarred.hacker_news.liked };
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

  async updateHackerNewsLikedtoUnliked(likedUuid: string, postUuid: string, clientUuid: string): Promise<void> {
    try {
      NewsLogger.debug('[Hacker] Give Hada News unStar Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.hacker_Liked.update({
        data: {
          hacker_news: {
            update: {
              liked: 0,
            },
          },
        },
        where: {
          uuid: likedUuid,
          postUuid,
          userUuid: clientUuid,
        },
      });
      NewsLogger.info('[Hacker] Unstarred Updated');
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

  async updateHackerNewsLiked(likedUuid: string, postUuid: string, clientUuid: string): Promise<void> {
    try {
      NewsLogger.debug('[Hacker] Give Hacker News Star Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.hacker_Liked.update({
        data: {
          hacker_news: {
            update: {
              liked: 1,
            },
          },
        },
        where: {
          uuid: likedUuid,
          postUuid,
          userUuid: clientUuid,
        },
      });

      NewsLogger.info('[Hacker] Starred Updated');
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

      const starredNews = await this.hacker_Liked.findMany({
        select: {
          hacker_news: {
            select: {
              uuid: true,
              post: true,
              link: true,
              founded: true,
            },
          },
        },
        where: {
          userUuid,
        },
        take: size,
        skip: (page - 1) * size,
      });
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

      NewsLogger.debug('[Hacker] Founded Starred News: %o', {
        totalPosts,
        newsSize: starredNews.length,
      });

      return {
        totalPosts,
        starredNews,
      };
    } catch (error) {
      NewsLogger.error('[Hacker] Get Starred News Error: %o', {
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
