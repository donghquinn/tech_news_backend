import { HadaError } from '@errors/hada.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import {
  checkHadaNewsIsLiked,
  getStarredHadaNewsPagination,
  updateHadaNewsLiked,
  updateHadaNewsLikedtoUnliked,
} from '@libraries/news/hada.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { HadaNewsReturn } from 'types/hada.type';

@Injectable()
export class HadaProvider {
  private resultNewsArray: Array<HadaNewsReturn>;

  constructor(private readonly prisma: PrismaLibrary) {
    this.resultNewsArray = [];
  }

  async getNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      const startDate = startOfDay(new Date(yesterday));
      const endDate = endOfDay(new Date(yesterday));

      NewsLogger.info('[HADA] YesterDay: %o', {
        start: startDate,
        end: endDate,
      });
      const result = await this.prisma.bringHadaNews(startDate, endDate);

      this.resultNewsArray.push(...result);

      for (let i = 0; i <= result.length - 1; i += 1) {
        const isUrlUndefined = result[i].descLink.split('.io/')[1];

        if (isUrlUndefined === 'undefined') {
          NewsLogger.info('[HADA] Found Undefiend Desc Card URL: %o', {
            title: result[i].post,
            descUrl: result[i].descLink,
            uuid: result[i].uuid,
            isUrlUndefined,
          });

          const reSearched = await this.prisma.hada.findFirst({
            select: {
              link: true,
            },
            where: {
              uuid: result[i].uuid,
            },
          });

          if (reSearched === null) {
            NewsLogger.info('[HADA] No Original Link Found: %o', {
              uuid: result[i].uuid,
              title: result[i].post,
            });
          } else if (this.resultNewsArray[i].uuid === result[i].uuid) {
            NewsLogger.info('[HADA] Put Original Link into return array: %o', {
              post: result[i].post,
              uuid: result[i].uuid,
              desc: result[i].descLink,
              originalLink: reSearched.link,
            });

            this.resultNewsArray[i].descLink = reSearched.link;
          }
        }
      }

      return result;
    } catch (error) {
      NewsLogger.error('[Hada] Bring Hada News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[HADA] Bring news',
        'Bring Hada News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string) {
    try {
      const isLiked = await checkHadaNewsIsLiked(this.prisma, uuid);

      if (isLiked) {
        await updateHadaNewsLikedtoUnliked(this.prisma, uuid);
      }

      if (!isLiked) {
        await updateHadaNewsLiked(this.prisma, uuid);
      }

      return true;
    } catch (error) {
      NewsLogger.error('[HADA] Star Update Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[HADA] Give Star on the news',
        'Failed to vie star news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews(page: number, size: number) {
    try {
      const pageNumber = typeof page === 'number' ? page : Number(page);
      const sizeNumber = typeof size === 'number' ? size : Number(size);

      NewsLogger.info('[HADA] Request to get Starred Hacker News');

      const tempUserUuid = '123';
      const starredNews = await getStarredHadaNewsPagination(this.prisma, pageNumber, sizeNumber, tempUserUuid);

      // const starredNews = await this.prisma.hada.findMany({
      //   select: {
      //     uuid: true,
      //     post: true,
      //     link: true,
      //     founded: true,
      //   },
      //   orderBy: {
      //     founded: 'desc',
      //   },
      //   where: {
      //     liked: 1,
      //     // client_id: userUuid
      //   },
      // });

      NewsLogger.info('[HADA] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error('[HADA] Get Starred Update Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new HadaError(
        '[HADA] Bring Starred Hacker News',
        'Failed to Bring Starred Hacker News. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
