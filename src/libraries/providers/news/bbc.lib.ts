import { Injectable, Logger } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { BbcError } from 'errors/bbc.error';
import { StatisticsError } from 'errors/statis.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import moment from 'moment-timezone';

@Injectable()
export class BbcNewsProvider {
  constructor(private prisma: PrismaLibrary) { }

  async bringTodayBbcNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      Logger.debug("BBC YesterDay: %o", { 
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.bbcTechNews.findMany({
        select: { post: true, link: true, founded: true },
        orderBy: { rank: 'desc' },
        where: {
          founded: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday))
          },
        },
      });

      await this.prisma.onModuleDestroy();

      return result;
    } catch (error) {
      Logger.error('Bring BBC News Error: %o', error instanceof Error ? error : new Error(JSON.stringify(error)));

      throw new BbcError(
        'BBC Error',
        'BBC News Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getBbcCount() {
    try {
      const count = await this.prisma.bbcTechNews.count({ select: { uuid: true } });

      Logger.log(`BBC News Count: ${ count.uuid }`);

      await this.prisma.onModuleDestroy();

      return count;
    } catch (error) {
      Logger.error('Get BBC Total News Count Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new StatisticsError(
        "Statistics",
        "Get Count Failed",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
