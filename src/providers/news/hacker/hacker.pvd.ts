/* eslint-disable @typescript-eslint/naming-convention */
import { HackerError } from '@errors/news.error';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { AccountManager } from 'providers/account-manager.pvd';
import { HackerPrismaLibrary } from './hacker-prisma.lib';

@Injectable()
export class HackersNewsProvider {
  constructor(
    private readonly prisma: HackerPrismaLibrary,
    private readonly account: AccountManager,
  ) {}

  async bringTodayHackerPosts(today: string, page: number, size: number) {
    const yesterday = moment(today).subtract(1, 'day').toDate();

    const startDate = startOfDay(new Date(yesterday));
    const endDate = endOfDay(new Date(yesterday));

    NewsLogger.debug('[Hackers] YesterDay: %o', {
      start: startDate,
      end: endDate,
      page,
      size,
    });

    const {totalCount, hackerNews} = await this.prisma.hackerNewsPagintaion(startDate, endDate, page, size);

    const returnData = hackerNews.map((item) => {
      const { uuid, post, link, founded, _count } = item;
      const { liked_model: count } = _count;

      return {
        uuid,
        post,
        link,
        likedCount: count,
        founded,
      };
    });

    return { result: returnData, total: Math.ceil(totalCount/size) };
  }

  async giveStar(postUuid: string, email: string): Promise<void> {
    const isLogined = await this.account.getItem(email);

    if (!isLogined) throw new HackerError('[Hackers] Give Star on the Stars', 'No Logined User Found.');

    const { uuid: clientUuid } = isLogined;
    const isStarred = await this.prisma.checkHackerNewsIsLiked(postUuid, clientUuid);

    if (isStarred === null) throw new HackerError('[HACKER] Get Star Info', 'No Star Info Found.');

    const { hacker_news: isLiked } = isStarred;

    if (isLiked.uuid === undefined) await this.prisma.createHackerNewsLiked(postUuid, clientUuid);
  }

  // Pagination
  async unStar(postUuid: string, email: string) {
    const isLogined = await this.account.getItem(email);

    if (!isLogined) throw new HackerError('[Hackers] Give Star on the Stars', 'No Logined User Found.');

    const { uuid: clientUuid } = isLogined;
    const isStarred = await this.prisma.checkHackerNewsIsLiked(postUuid, clientUuid);

    if (isStarred === null) throw new HackerError('[HACKER] Get Star Info', 'No Star Info Found.');

    const { hacker_news: isLiked } = isStarred;
    const { uuid: likedUuid } = isLiked;

    if (likedUuid) await this.prisma.deleteHackerNewsLiked(likedUuid, postUuid, clientUuid);

    NewsLogger.info('[Hackers] Unstar Hacker News Finished');
  }
}
