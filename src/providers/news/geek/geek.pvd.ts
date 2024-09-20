/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { GeekError } from '@errors/news.error';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { AccountManager } from 'providers/account-manager.pvd';
import { GeekNewsReturn } from 'types/geek.type';
import { GeekPrismaLibrary } from './geek-prisma.lib';

@Injectable()
export class GeekProvider {
  constructor(
    private readonly prisma: GeekPrismaLibrary,
    private readonly account: AccountManager,
  ) {}

  async getNews(today: string, page: number, size: number) {
    const yesterday = moment(today).subtract(1, 'day').toDate();

    const startDate = startOfDay(new Date(yesterday));
    const endDate = endOfDay(new Date(yesterday));

    NewsLogger.debug('[GEEK] YesterDay: %o', {
      start: startDate,
      end: endDate,
      page,
      size,
    });

    const {totalCount, geekNews} = await this.prisma.geekNewsPagination(startDate, endDate, page, size);

    const returnData: Array<GeekNewsReturn> = geekNews.map((item) => {
      const isUrlUndefined = item.descLink.split('.io/')[1];

      const { post, descLink, uuid, link, _count, founded } = item;
      const { liked_model: likedCount } = _count;

      if (isUrlUndefined === 'undefined')
        return {
          post,
          uuid,
          descLink: link,
          founded,
          likedCount,
        };

      return {
        post,
        uuid,
        descLink,
        founded,
        likedCount,
      };
    });

    return { result: returnData, total: Math.ceil(totalCount/size) };
  }

  async giveStar(postUuid: string, email: string): Promise<void> {
    const isLogined = await this.account.getItem(email);

    if (isLogined === false) throw new GeekError('[GEEK] Give Star on the Stars', 'No Logined User Found.');

    const { uuid: clientUuid } = isLogined;

    const isStarred = await this.prisma.checkGeekNewsIsLiked(postUuid, clientUuid);
    const { geek_news: isLiked } = isStarred;

    if (isLiked === undefined) await this.prisma.createGeekNewsLiked(postUuid, clientUuid);
  }

  async unStar(postUuid: string, email: string): Promise<void> {
    const isLogined = await this.account.getItem(email);

    if (isLogined === false) throw new GeekError('[GEEK] Give Star on the Stars', 'No Logined User Found.');

    const { uuid: clientUuid } = isLogined;
    const isStarred = await this.prisma.checkGeekNewsIsLiked(postUuid, clientUuid);

    const { geek_news: isLiked } = isStarred;

    const { uuid: likedUuid } = isLiked;
    if (likedUuid) await this.prisma.deleteGeekNewsLiked(likedUuid, postUuid, clientUuid);

    NewsLogger.info('[GEEK] Finished UnStar Geek News');
  }
}
