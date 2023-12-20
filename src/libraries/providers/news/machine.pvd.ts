import { MachineLearningError } from '@errors/machine.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class MachineLearningProvider {
  constructor(private readonly prisma: PrismaLibrary) {}

  async bringLatestMachineLearningNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      NewsLogger.info('[ML] Latest Machine Learning News: %o', {
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.machineNews.findMany({
        select: {
          uuid: true,
          category: true,
          title: true,
          link: true,
          founded: true,
        },
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
      NewsLogger.error('[ML] Get Latest Machine Learning News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        'Get Latest Machine Learning News',
        'Failed to Get Latest Machine Learning News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string, isStarred: boolean) {
    try
    {
      if ( !isStarred )
      {
        NewsLogger.info('[ML] Give ML News Star Request: %o', {
        uuid,
      });

      await this.prisma.machineNews.update({
        data: {
          liked: '0',
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[ML] Starred Updated');
      } else
      {
         NewsLogger.info('[ML] Give ML News Star Request: %o', {
        uuid,
      });

      await this.prisma.machineNews.update({
        data: {
          liked: '1',
        },
        where: {
          uuid,
        },
      });

      NewsLogger.info('[ML] Starred Updated');

      }
     
      return true;
    } catch (error) {
      NewsLogger.error('[ML] Give Star on the ML News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        'Give Star on the ML news',
        'Failed to vie star ML news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews() {
    try {
      NewsLogger.info('[ML] Request to get Starred ML News');

      const starredNews = await this.prisma.machineNews.findMany({
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
          liked: '1',
        },
      });

      NewsLogger.info('[ML] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error('[ML] Bring Starred ML News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        'Bring Starred ML News',
        'Failed to Bring Starred ML News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
