/* eslint-disable @typescript-eslint/naming-convention */
import { MachineLearningError } from '@errors/news.error';
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
    const yesterday = moment(today).subtract(1, 'day').toDate();

    const startDate = startOfDay(new Date(yesterday));
    const endDate = endOfDay(new Date(yesterday));

    NewsLogger.debug('[ML] YesterDay: %o', {
      start: startDate,
      end: endDate,
      page,
      size,
    });

    const returnData = await this.prisma.bringMlNews(startDate, endDate, page, size);

    const total = await this.prisma.mlTotalCount(startDate, endDate, size);

    NewsLogger.info('[ML] Get Total Count: %o', {
      total,
    });

    return { result: returnData, total };
  }

  async giveStar(postUuid: string, email: string): Promise<void> {
    const isLogined = await this.account.getItem(email);

    if (!isLogined) throw new MachineLearningError('[ML] Give Star on the Stars', 'No Logined User Found.');

    const { uuid: clientUuid } = isLogined;
    const isStarred = await this.prisma.checkIsMlNewsLiked(postUuid, clientUuid);

    if (isStarred === null) throw new MachineLearningError('[ML] Get Star Info', 'No Star Info Found.');

    const { ml_news: isLiked } = isStarred;

    if (isLiked === undefined) await this.prisma.createMlNewsLiked(postUuid, clientUuid);
  }

  async unStar(postUuid: string, email: string): Promise<void> {
    const isLogined = await this.account.getItem(email);

    if (isLogined === false) throw new MachineLearningError('[ML] UnStar on the Stars', 'No Logined User Found.');

    const { uuid: clientUuid } = isLogined;
    const isStarred = await this.prisma.checkIsMlNewsLiked(postUuid, clientUuid);

    if (isStarred === null) throw new MachineLearningError('[ML] Get Star Info', 'No Star Info Found.');

    const { ml_news: isLiked } = isStarred;

    if (isLiked.uuid) await this.prisma.deleteMlNewsLiked(isLiked.uuid, postUuid, clientUuid);

    NewsLogger.info('[ML] Unstar News Finished');
  }
}
