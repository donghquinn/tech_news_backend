/* eslint-disable @typescript-eslint/naming-convention */
import { MachineLearningError } from '@errors/news.error';
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
        take: Number(size),
        skip: (Number(page) - 1) * Number(size),
      });

      const returnData = result.map((item) => {
        const { uuid, link, title, founded, _count, category } = item;
        const { liked_model: count } = _count;

        return {
          uuid,
          title,
          category,
          link,
          likedCount: count,
          founded,
        };
      });

      return returnData;
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

  async mlTotalCount(startDate: Date, endDate: Date, size: number) {
    try {
      const totalCounts = await this.machineNews.count({
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return Math.ceil(totalCounts / size);
    } catch (error) {
      NewsLogger.error('[ML] Bring Total ML News Error: %o', {
        error,
      });

      throw new PrismaError(
        '[ML] Bring Total ML News',
        'Bring Total ML News Error. Please Try Again.',
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
              uuid: true,
            },
          },
        },
        where: {
          userUuid: clientUuid,
          postUuid,
        },
      });

      return isStarred;
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

  async deleteMlNewsLiked(likedUuid: string, postUuid: string, clientUuid: string): Promise<void> {
    try {
      NewsLogger.debug('[ML] Give Hada News unStar Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.ml_Liked.delete({
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

  async createMlNewsLiked(postUuid: string, clientUuid: string): Promise<void> {
    try {
      NewsLogger.debug('[ML] Give Hacker News Star Request: %o', {
        postUuid,
        clientUuid,
      });

      await this.ml_Liked.create({
        data: {
          postUuid,
          userUuid: clientUuid,
          newsPlatform: 'ML',
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

  async getStarredMlNewsPagination(page: number, size: number, userUuid: string) {
    try {
      const totalPosts = await this.ml_Liked.count({
        where: {
          userUuid,
        },
      });

      const starredNews = await this.ml_Liked.findMany({
        select: {
          uuid: true,
          ml_news: {
            select: {
              uuid: true,
              title: true,
              link: true,
              founded: true,
            },
          },
        },
        orderBy: {
          ml_news: {
            founded: 'desc',
          },
        },
        where: {
          userUuid,
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
