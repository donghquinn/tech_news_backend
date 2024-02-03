import { HadaError } from '@errors/hada.error';
import { PrismaError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class GeekPrismaLibrary extends PrismaClient {
  async bringHadaNews(startDate: Date, endDate: Date) {
    try {
      const result = await this.geek.findMany({
        select: { uuid: true, post: true, link: true,
          descLink: true, founded: true, liked: true },
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
      NewsLogger.error('[HADA] Bring Geek News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new PrismaError(
        '[HADA] Bring Geek News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async checkHadaNewsIsLiked(uuid: string) {
    try {
      const isStarred = await this.geek.findFirst({
        select: {
          liked: true,
        },
        where: {
          uuid,
        },
      });

      if (isStarred === null) throw new HadaError('[Hada] Get Star Info', 'No Star Info Found.');

      NewsLogger.info('[Hada] Found Is Starred Info: %o', {
        isLiked: isStarred?.liked,
      });

      return isStarred.liked;
    } catch (error) {
      NewsLogger.error('[Hada] Check Hada News Liked Info Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[Hada] Check Hada News Liked Info',
        'Check Hada News Liked Info Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateHadaNewsLikedtoUnliked(uuid: string) {
    try {
      NewsLogger.info('[HADA] Give Hada News unStar Request: %o', {
        uuid,
      });

      await this.geek.update({
        data: {
          liked: 0,
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[HADA] Unstarred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[Hada] Update Liked to UnLiked Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[Hada] Update Liked to UnLiked',
        'Update Liked to UnLiked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateHadaNewsLiked(uuid: string) {
    try {
      NewsLogger.info('[HADA] Give Hacker News Star Request: %o', {
        uuid,
      });

      await this.geek.update({
        data: {
          liked: 1,
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[HADA] Starred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[Hada] Update News Liked Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[Hada] Update News Liked',
        'Update News Liked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getStarredHadaNewsPagination(page: number, size: number) {
    try {
      const totalPosts = await this.geek.count({ where: { liked: 1 } });

      const starredNews = await this.geek.findMany({
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
        take: size,
        skip: (page - 1) * size,
      });

      NewsLogger.info('[Hada] Founded Starred News: %o', {
        totalPosts,
        newsSize: starredNews.length,
      });

      return {
        totalPosts,
        starredNews,
      };
    } catch (error) {
      NewsLogger.info('[Hada] Get Starred News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[Hada] Get Starred News',
        'Get Starred News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
