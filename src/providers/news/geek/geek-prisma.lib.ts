import { GeekError } from '@errors/geek.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class GeekPrismaLibrary extends PrismaClient {
  async bringGeekNews(startDate: Date, endDate: Date, page: number, size: number) {
    try {
      const result = await this.geek.findMany({
        select: { uuid: true, post: true, link: true, descLink: true, founded: true, liked: true },
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
      NewsLogger.error('[GEEK] Bring Geek News Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Bring Geek News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async geekNewsCount(startDate: Date, endDate: Date, size: number) {
    try {
      const totalCounts = await this.geek.count({
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return Math.ceil(totalCounts / size);
    } catch (error) {
      NewsLogger.error('[GEEK] Bring Total Geek News Count Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Bring Total Geek News Count',
        'Bring Total Geek News Count Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async checkGeekNewsIsLiked(postUuid: string, clientUuid: string) {
    try {
      const isStarred = await this.geek_Liked.findFirst({
        select: {
          uuid: true,
          geek_news: {
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

      if (isStarred === null) throw new GeekError('[GEEK] Get Star Info', 'No Star Info Found.');

      NewsLogger.debug('[GEEK] Found Is Starred Info: %o', {
        isLiked: isStarred.geek_news.liked,
      });

      return { uuid: isStarred.uuid, liked: isStarred.geek_news.liked };
    } catch (error) {
      NewsLogger.error('[GEEK] Check Hada News Liked Info Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Check Hada News Liked Info',
        'Check Hada News Liked Info Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateGeekNewsLikedtoUnliked(likedUuid: string, postUuid: string, clientUuid: string) {
    try {
      NewsLogger.debug('[GEEK] Give Hada News unStar Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.geek_Liked.update({
        data: {
          geek_news: {
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

      NewsLogger.info('[GEEK] Unstarred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[GEEK] Update Liked to UnLiked Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Update Liked to UnLiked',
        'Update Liked to UnLiked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateGeekNewsLiked(likedUuid: string, postUuid: string, clientUuid: string) {
    try {
      NewsLogger.debug('[GEEK] Give Hacker News Star Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.geek_Liked.update({
        data: {
          geek_news: {
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

      NewsLogger.info('[GEEK] Starred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[GEEK] Update News Liked Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Update News Liked',
        'Update News Liked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
