import { NaverError } from '@errors/naver.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class NaverProvider {
  constructor(private prisma: PrismaLibrary) {}

  async getNaverNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      NewsLogger.info('[NAVER] YesterDay: %o', {
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.naverNews.findMany({
        select: {
          uuid: true,
          keyWord: true,
          title: true,
          description: true,
          originallink: true,
          postedTime: true,
          founded: true,
        },
        where: {
          founded: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday)),
          },
        },
        orderBy: { founded: 'desc' },
      });

      await this.prisma.onModuleDestroy();

      return result;
    } catch (error) {
      NewsLogger.error('[NAVER] Bring Today News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new NaverError(
        '[NAVER] Get Today Naver News',
        'Get Naver News Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string) {
    try {
      NewsLogger.info('[NAVER] Give Star Naver News Request: %o', {
        uuid,
      });

      await this.prisma.naverNews.update({
        data: {
          liked: '1',
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[NAVER] Starred Updated');

      return true;
    } catch (error) {
      NewsLogger.error('[NAVER] Give Star on the Naver News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new NaverError(
        'Give Star on the Naver news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async unStar(uuid: string) {
    try {
      NewsLogger.debug('[ML] Give Star Naver news Request: %o', {
        uuid,
      });

      await this.prisma.naverNews.update({
        data: {
          liked: '0',
        },
        where: {
          uuid,
        },
      });

      await this.prisma.onModuleDestroy();

      NewsLogger.info('[ML] Starred Updated');

      return true;
    } catch (error) {
      NewsLogger.error('[NAVER] unStar on the Naver News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new NaverError(
        'unStar on the Naver News',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews() {
    try {
      NewsLogger.info('[ML] Request to get Starred Naver News');

      const starredNews = await this.prisma.naverNews.findMany({
        select: {
          uuid: true,
          title: true,
          url: true,
          founded: true,
        },
        orderBy: {
          founded: 'desc',
        },
        where: {
          liked: '1',
        },
      });

      NewsLogger.info('[ML] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error('[NAVER] Bring Starred News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new NaverError(
        'Bring Starred Naver News',
        'Failed to Bring Starred Naver News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
