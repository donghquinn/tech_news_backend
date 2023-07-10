import { Injectable, Logger } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { NaverError } from 'errors/naver.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import moment from 'moment-timezone';

@Injectable()
export class NaverProvider {
  constructor(private prisma: PrismaLibrary) { }

  async getNaverNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      Logger.debug("YesterDay: %o", { 
        start: startOfDay(new Date(yesterday)).toString(),
        end: endOfDay(new Date(yesterday)).toString(),
      });
      
      const result = await this.prisma.naverNews.findMany({
        select: {
          keyWord: true,
          title: true,
          description: true,
          originallink: true,
          postedTime: true,
          founded: true,
        },
        where: {
          founded: {
            lt: startOfDay(new Date(today)),
            gte: endOfDay(new Date(today))
          },
        },
        orderBy: { founded: 'desc' },
      });

      return result;
    } catch (error) {
      Logger.error('Bring Naver Today News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new NaverError(
        'Get Today Naver News',
        'Get Naver News Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
