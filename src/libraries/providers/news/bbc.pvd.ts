import { BbcError } from '@errors/bbc.error';
import { StatisticsError } from '@errors/statis.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class BbcNewsProvider {
  constructor(private prisma: PrismaLibrary) {}

  async bringTodayBbcNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      NewsLogger.info('[BBC] BBC YesterDay: %o', {
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.bbcTechNews.findMany({
        select: { uuid: true, post: true, link: true, founded: true },
        orderBy: { rank: 'desc' },
        where: {
          founded: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday)),
          },
        },
      });

      await this.prisma.onModuleDestroy();

      return result;
    } catch (error) {
      NewsLogger.error('[BBC] Bring News Error: %o', error instanceof Error ? error : new Error(JSON.stringify(error)));

      throw new BbcError(
        '[BBC] BBC Error',
        'BBC News Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getBbcCount() {
    try {
      const count = await this.prisma.bbcTechNews.count({ select: { uuid: true } });

      NewsLogger.info(`BBC News Count: ${count.uuid}`);

      await this.prisma.onModuleDestroy();

      return count;
    } catch (error) {
      NewsLogger.error('Get BBC Total News Count Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new StatisticsError(
        'Statistics',
        'Get Count Failed',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  // Bring Date List
  async getDateList() {
    try {
      const dateLists = await this.prisma.bbcTechNews.findMany({
        select: {
          founded: true,
        },
        distinct: ['founded'],
      });

      NewsLogger.debug('[BBC] Date List: %o', { dateLists });

      await this.prisma.onModuleDestroy();

      return dateLists;
    } catch (error) {
      NewsLogger.error(
        '[BBC] Get Date List Error: %o',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );

      throw new BbcError(
        'BBC Get Date List',
        'Failed To Get List',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getMatchingData(today: string) {
    try {
      const date = moment(today).toString();

      NewsLogger.info('[BBC] Requested Date: %o', {
        date,
      });

      const bbcData = await this.prisma.bbcTechNews.findMany({
        select: { post: true, link: true, founded: true },
        orderBy: { rank: 'desc' },
        where: {
          founded: {
            gte: startOfDay(new Date(date)),
            lte: endOfDay(new Date(date)),
          },
        },
      });

      await this.prisma.onModuleDestroy();

      return bbcData;
    } catch (error) {
      NewsLogger.error(
        '[BBC] Get Date Matching Data Error: %o',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );

      throw new BbcError(
        '[BBC] Get BBC Date Matching Data',
        'Failed to get Matching Data',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string) {
    try {
      NewsLogger.debug('[BBC] Give Star Request: %o', {
        uuid,
      });

      await this.prisma.bbcTechNews.update({
        data: {
          liked: '1',
        },
        where: {
          uuid,
        },
      });

      await this.prisma.onModuleDestroy();

      NewsLogger.info('[BBC] Starred Updated');

      return true;
    } catch (error) {
      NewsLogger.error(
        '[BBC] Give Star on the news Error: %o',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );

      throw new BbcError(
        '[BBC] Give Star on the news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async unStar(uuid: string) {
    try {
      NewsLogger.info('[BBC] Give Star Request: %o', {
        uuid,
      });

      await this.prisma.bbcTechNews.update({
        data: {
          liked: '0',
        },
        where: {
          uuid,
        },
      });

      await this.prisma.onModuleDestroy();

      NewsLogger.info('[BBC] Starred Updated');

      return true;
    } catch (error) {
      NewsLogger.error(
        '[BBC] unStar on the News Error: %o',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );

      throw new BbcError(
        '[BBC] unStar on the news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews() {
    try {
      NewsLogger.info('[BBC] Request to get Starred News');

      const starredNews = await this.prisma.bbcTechNews.findMany({
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
          liked: '1',
        },
      });

      await this.prisma.onModuleDestroy();

      NewsLogger.info('[BBC] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error(
        '[BBC] Bring Starred BBC News Error: %o',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );

      throw new BbcError(
        '[BBC] Bring Starred BBC News',
        'Failed to Bring Starred BBC News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
