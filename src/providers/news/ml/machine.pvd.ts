/* eslint-disable @typescript-eslint/naming-convention */
import { MachineLearningError } from '@errors/machine.error';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { AccountManager } from 'providers/account-manager.pvd';
import { MlPrismaLibrary } from './ml-prisma.lib';

@Injectable()
export class MachineLearningProvider {
  constructor(
    private readonly prisma: MlPrismaLibrary,
    private readonly account: AccountManager,
  ) {}

  async bringLatestMachineLearningNews(today: string, page: number, size: number) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toDate();

      const startDate = startOfDay(new Date(yesterday));
      const endDate = endOfDay(new Date(yesterday));

      NewsLogger.debug('[ML] YesterDay: %o', {
        start: startDate,
        end: endDate,
        page,
        size,
      });

      const result = await this.prisma.bringMlNews(startDate, endDate, page, size);

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

      const total = await this.prisma.mlTotalCount(startDate, endDate, size);

      NewsLogger.info('[ML] Get Total Count: %o', {
        total,
      });

      return { result: returnData, total };
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

  async giveStar(postUuid: string, email: string): Promise<void> {
    try {
      const isLogined = await this.account.getItem(email);

      if (!isLogined) throw new MachineLearningError('[ML] Give Star on the Stars', 'No Logined User Found.');

      const { uuid: clientUuid } = isLogined;
      const isStarred = await this.prisma.checkIsMlNewsLiked(postUuid, clientUuid);

      if (isStarred === null) throw new MachineLearningError('[ML] Get Star Info', 'No Star Info Found.');

      const { ml_news: isLiked } = isStarred;

      if (isLiked === undefined) await this.prisma.createMlNewsLiked(postUuid, clientUuid);
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

  async unStar(postUuid: string, email: string): Promise<void> {
    try {
      const isLogined = await this.account.getItem(email);

      if (isLogined === null) throw new MachineLearningError('[ML] UnStar on the Stars', 'No Logined User Found.');

      const { uuid: clientUuid } = isLogined;
      const isStarred = await this.prisma.checkIsMlNewsLiked(postUuid, clientUuid);

      if (isStarred === null) throw new MachineLearningError('[ML] Get Star Info', 'No Star Info Found.');

      const { ml_news: isLiked } = isStarred;

      if (isLiked.uuid) await this.prisma.deleteMlNewsLiked(isLiked.uuid, postUuid, clientUuid);

      NewsLogger.info('[ML] Unstar News Finished');
    } catch (error) {
      NewsLogger.error('[ML] Unstar ML News Error: %o', {
        error,
      });

      throw new MachineLearningError(
        'Unstar ML News',
        'Failed to Unstar ML News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
