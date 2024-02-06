import { MachineLearningError } from '@errors/machine.error';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { AccountManager } from 'providers/auth/account-manager.pvd';
import { MlPrismaLibrary } from './ml-prisma.lib';

@Injectable()
export class MachineLearningProvider {
  constructor(
    private readonly prisma: MlPrismaLibrary,
    private readonly account: AccountManager,
  ) {}

  async bringLatestMachineLearningNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toDate();

      const startDate = startOfDay(new Date(yesterday));
      const endDate = endOfDay(new Date(yesterday));

      NewsLogger.info('[ML] YesterDay: %o', {
        start: startDate,
        end: endDate,
      });
      const result = await this.prisma.bringMlNews(startDate, endDate);

      return result;
    } catch (error) {
      NewsLogger.error('[ML] Get Latest Machine Learning News Error: %o', {
        error,
      });

      throw new MachineLearningError(
        'Get Latest Machine Learning News',
        'Failed to Get Latest Machine Learning News. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(postUuid: string, clientUuid: string) {
    try {
      const isLogined = this.account.getItem(clientUuid);

      if (!isLogined) throw new MachineLearningError('[ML] Give Star on the Stars', 'No Logined User Found.');

      const { uuid: likedUuid, isLiked } = await this.prisma.checkIsMlNewsLiked(postUuid, clientUuid);

      if (!isLiked) {
        await this.prisma.updateMlNewsLiked(likedUuid, postUuid, clientUuid);
      }

      if (isLiked) {
        await this.prisma.updateMlNewsLikedtoUnliked(likedUuid, postUuid, clientUuid);
      }

      return true;
    } catch (error) {
      NewsLogger.error('[ML] Give Star on the ML News Error: %o', {
        error,
      });

      throw new MachineLearningError(
        'Give Star on the ML news',
        'Failed to vie star ML news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews(page: number, size: number) {
    try {
      const pageNumber = typeof page === 'number' ? page : Number(page);
      const sizeNumber = typeof size === 'number' ? size : Number(size);

      NewsLogger.info('[ML] Request to get Starred ML News');

      const starredNews = await this.prisma.getStarredMlNewsPagination(pageNumber, sizeNumber);

      NewsLogger.info('[ML] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error('[ML] Bring Starred ML News Error: %o', {
        error,
      });

      throw new MachineLearningError(
        'Bring Starred ML News',
        'Failed to Bring Starred ML News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
