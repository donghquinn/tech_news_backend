import { MachineLearningError } from '@errors/machine.error';
import { PrismaError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class MlPrismaLibrary extends PrismaClient {
  async bringMlNews(startDate: Date, endDate: Date, page: number, size: number) {
    try {
      const result = await this.machineNews.findMany({
        select: {
          uuid: true,
          category: true,
          title: true,
          link: true,
          founded: true,
        },
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
        take: Number(size),
        skip: (Number(page) - 1) * Number(size),
      });

      const totalCounts = await this.machineNews.count({
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

  async checkIsMlNewsLiked(postUuid: string, clientUuid: string) {
    try {
      const isStarred = await this.ml_Liked.findFirst({
        select: {
          uuid: true,
          ml_news: {
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

      if (isStarred === null) throw new MachineLearningError('[ML] Get Star Info', 'No Star Info Found.');

      NewsLogger.debug('[ML] Found Is Starred Info: %o', {
        isLiked: isStarred.ml_news.liked,
      });

      return { uuid: isStarred.uuid, isLiked: isStarred.ml_news.liked };
    } catch (error) {
      NewsLogger.error('[ML] Check Hada News Liked Info Error: %o', {
        error,
      });

      throw new MachineLearningError(
        '[ML] Check Hada News Liked Info',
        'Check Hada News Liked Info Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateMlNewsLikedtoUnliked(likedUuid: string, postUuid: string, clientUuid: string): Promise<void> {
    try {
      NewsLogger.debug('[ML] Give Hada News unStar Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.ml_Liked.update({
        data: {
          ml_news: {
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
      NewsLogger.info('[ML] Unstarred Updated');
    } catch (error) {
      NewsLogger.error('[ML] Update Liked to UnLiked Error: %o', {
        error,
      });

      throw new MachineLearningError(
        '[ML] Update Liked to UnLiked',
        'Update Liked to UnLiked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateMlNewsLiked(likedUuid: string, postUuid: string, clientUuid: string): Promise<void> {
    try {
      NewsLogger.debug('[ML] Give Hacker News Star Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.ml_Liked.update({
        data: {
          ml_news: {
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

      NewsLogger.info('[ML] Starred Updated');
    } catch (error) {
      NewsLogger.error('[ML] Update News Liked Error: %o', {
        error,
      });

      throw new MachineLearningError(
        '[ML] Update News Liked',
        'Update News Liked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getStarredMlNewsPagination(page: number, size: number) {
    try {
      const totalPosts = await this.machineNews.count({ where: { liked: 1 } });

      const starredNews = await this.machineNews.findMany({
        select: {
          uuid: true,
          title: true,
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

      NewsLogger.debug('[ML] Founded Starred News: %o', {
        totalPosts,
        newsSize: starredNews.length,
      });

      return {
        totalPosts,
        starredNews,
      };
    } catch (error) {
      NewsLogger.info('[ML] Get Starred News Error: %o', {
        error,
      });

      throw new MachineLearningError(
        '[ML] Get Starred News',
        'Get Starred News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
