import { MachineLearningError } from '@errors/machine.error';
import { PrismaError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class MlPrismaLibrary extends PrismaClient {
  async bringMlNews(startDate: Date, endDate: Date) {
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
      });

      return result;
    } catch (error) {
      NewsLogger.error('[ML] Bring Geek News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new PrismaError(
        '[ML] Bring Geek News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async checkIsMlNewsLiked(uuid: string) {
    try {
      const isStarred = await this.machineNews.findFirst({
        select: {
          liked: true,
        },
        where: {
          uuid,
        },
      });

      if (isStarred === null) throw new MachineLearningError('[ML] Get Star Info', 'No Star Info Found.');

      NewsLogger.info('[ML] Found Is Starred Info: %o', {
        isLiked: isStarred.liked,
      });

      return isStarred.liked;
    } catch (error) {
      NewsLogger.error('[ML] Check Hada News Liked Info Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        '[ML] Check Hada News Liked Info',
        'Check Hada News Liked Info Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateMlNewsLikedtoUnliked(uuid: string) {
    try {
      NewsLogger.info('[ML] Give Hada News unStar Request: %o', {
        uuid,
      });

      await this.machineNews.update({
        data: {
          liked: 0,
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[ML] Unstarred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[ML] Update Liked to UnLiked Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        '[ML] Update Liked to UnLiked',
        'Update Liked to UnLiked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateMlNewsLiked(uuid: string) {
    try {
      NewsLogger.info('[ML] Give Hacker News Star Request: %o', {
        uuid,
      });

      await this.machineNews.update({
        data: {
          liked: 1,
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[ML] Starred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[ML] Update News Liked Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        '[ML] Update News Liked',
        'Update News Liked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getStarredMlNewsPagination(page: number, size: number, userUuid: string) {
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
          liked_client: userUuid,
        },
        take: size,
        skip: (page - 1) * size,
      });

      NewsLogger.info('[ML] Founded Starred News: %o', {
        totalPosts,
        newsSize: starredNews.length,
      });

      return {
        totalPosts,
        starredNews,
      };
    } catch (error) {
      NewsLogger.info('[ML] Get Starred News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        '[ML] Get Starred News',
        'Get Starred News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
