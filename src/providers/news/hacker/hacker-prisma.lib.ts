import { HackerError } from '@errors/news.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class HackerPrismaLibrary extends PrismaClient {
  async bringHackerNews(startDate: Date, endDate: Date, page: number, size: number) {
    try {
      const result = await this.hackers.findMany({
        select: {
          uuid: true,
          post: true,
          link: true,
          founded: true,
          _count: {
            select: {
              liked_model: true,
            },
          },
        },
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

      return result;
    } catch (error) {
      NewsLogger.error('[HACKER] Bring Hacker News Error: %o', {
        error,
      });

      throw new HackerError(
        '[HACKER] Bring Hacker News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async hackerNewsCount(startDate: Date, endDate: Date, size: number) {
    try {
      const totalCounts = await this.hackers.count({
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return Math.ceil(totalCounts / size);
    } catch (error) {
      NewsLogger.error('[HACKER] Bring Total Hackers News Count Error: %o', {
        error,
      });

      throw new HackerError(
        '[HACKER] Bring Total Hackers News Count',
        'Bring Total Hackers News Count Error. Please Try Again.',
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
              uuid: true,
            },
          },
        },
        where: {
          postUuid,
          userUuid: clientUuid,
        },
      });

      // NewsLogger.debug('[HACKER] Found Is Starred Info: %o', {
      //   isLiked: isStarred.hacker_news.liked,
      // });

      return isStarred;
    } catch (error) {
      NewsLogger.error('[HACKER] Check Hacker News Liked Info Error: %o', {
        error,
      });

      throw new HackerError(
        '[HACKER] Check Hacker News Liked Info',
        'Check Hada News Liked Info Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async deleteHackerNewsLiked(likedUuid: string, postUuid: string, clientUuid: string): Promise<void> {
    try {
      NewsLogger.debug('[HACKER] Give Hacker News unStar Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.hacker_Liked.delete({
        where: {
          uuid: likedUuid,
          postUuid,
          userUuid: clientUuid,
        },
      });

      NewsLogger.info('[HACKER] Unstarred Updated');
    } catch (error) {
      NewsLogger.error('[HACKER] Update Liked to UnLiked Error: %o', {
        error,
      });

      throw new HackerError(
        '[HACKER] Update Liked to UnLiked',
        'Update Liked to UnLiked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async createHackerNewsLiked(postUuid: string, clientUuid: string): Promise<void> {
    try {
      NewsLogger.debug('[HACKER] Give Hacker News Star Request: %o', {
        postUuid,
        clientUuid,
      });

      await this.hacker_Liked.create({
        data: {
          postUuid,
          userUuid: clientUuid,
          newsPlatform: 'Hacker',
        },
      });

      NewsLogger.info('[HACKER] Starred Updated');
    } catch (error) {
      NewsLogger.error('[HACKER] Update News Liked Error: %o', {
        error,
      });

      throw new HackerError(
        '[HACKER] Update News Liked',
        'Update News Liked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getStarredHackerNewsPagination(page: number, size: number, userUuid: string) {
    try {
      const totalPosts = await this.hacker_Liked.count({
        where: {
          userUuid,
        },
      });

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
        orderBy: {
          hacker_news: {
            founded: 'desc',
          },
        },
        where: {
          userUuid,
        },
        take: size,
        skip: (page - 1) * size,
      });

      NewsLogger.debug('[HACKER] Founded Starred News: %o', {
        totalPosts,
        newsSize: starredNews.length,
      });

      return {
        totalPosts,
        starredNews,
      };
    } catch (error) {
      NewsLogger.error('[HACKER] Get Starred News Error: %o', {
        error,
      });

      throw new HackerError(
        '[HACKER] Get Starred News',
        'Get Starred News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
