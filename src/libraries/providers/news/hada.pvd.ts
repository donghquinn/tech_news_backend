import { HadaError } from '@errors/hada.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
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

      NewsLogger.info('[HadaNews] YesterDay: %o', {
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.hada.findMany({
        select: { uuid: true, post: true, descLink: true, founded: true },
        where: {
          founded: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday)),
          },
        },
        orderBy: { rank: 'desc' },
      });

      this.resultNewsArray.push(...result);

      for (let i = 0; i <= result.length - 1; i += 1) {
        const isUrlUndefined = result[i].descLink.split('.io/')[1];

        NewsLogger.info('[HADA] Found Undefiend Desc Card URL: %o', {
          title: result[i].post,
          descUrl: result[i].descLink,
          uuid: result[ i ].uuid,
          isUrlUndefined,
        });

        if (isUrlUndefined === 'undefined') {
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
            this.resultNewsArray[i].descLink = reSearched.link;
          }
        }
      }

      return result;
    } catch (error) {
      NewsLogger.error(
        '[Hada] Bring Hada News Error: %o',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );

      throw new HadaError(
        '[HADA] Bring news',
        'Bring Hada News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string, isStarred: boolean) {
    try {
      if (!isStarred) {
        NewsLogger.info('[HADA] Give Hada News unStar Request: %o', {
          uuid,
        });

        await this.prisma.hada.update({
          data: {
            liked: '0',
          },
          where: {
            uuid,
          },
        });

        NewsLogger.info('[HADA] Unstarred Updated');
      } else {
        NewsLogger.info('[HADA] Give Hacker News Star Request: %o', {
          uuid,
        });

        await this.prisma.hada.update({
          data: {
            liked: '1',
          },
          where: {
            uuid,
          },
        });

        NewsLogger.info('[HADA] Starred Updated');
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

  async bringStarredNews() {
    try {
      NewsLogger.info('[HADA] Request to get Starred Hacker News');

      const starredNews = await this.prisma.hada.findMany({
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
