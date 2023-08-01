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
        select: { uuid: true, post: true, link: true, founded: true },
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

  // Bring Date List 
  async getDateList() {
    try {
        const dateLists = await this.prisma.bbcTechNews.findMany(
            { 
                select: { 
                    founded: true,
                }, 
                distinct: ["founded"]
            }
        );

        Logger.debug("Date List: %o", { dateLists });

        await this.prisma.onModuleDestroy();

        return dateLists;
    } catch (error) {
        throw new BbcError(
            "BBC Get Date List", 
            "Failed To Get List", 
            error instanceof Error ? error : new Error(JSON.stringify(error))
            );
      }
  }

  async getMatchingData(today: string) {
    try {
      const date = moment(today).toString();

      Logger.log("Requested Date: %o", {
        date
      });

      const bbcData = await this.prisma.bbcTechNews.findMany({ select: { post: true, link: true, founded: true },
        orderBy: { rank: 'desc' },
        where: {
          founded: {
            gte: startOfDay(new Date(date)),
            lte: endOfDay(new Date(date))
          },
        }, 
      });

      await this.prisma.onModuleDestroy();

      return bbcData;
    } catch (error) {
      throw new BbcError(
        "Get BBC Date Matching Data",
        "Failed to get Matching Data",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      )
    }
  }

  async giveStar(uuid: string) {
    try {
      Logger.debug("Give Star Request: %o", {
        uuid
      });

      await this.prisma.bbcTechNews.update({
        data: {
          starred: "1"
        },
        where: {
          uuid
        }
      });

      await this.prisma.onModuleDestroy();

      Logger.log("Starred Updated");

      return true;
    } catch (error) {
      throw new BbcError(
        "Give Star on the news",
        "Failed to vie star news",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      )
    }
  }

  async bringStarredNews() {
    try {
      Logger.log("Request to get Starred News");
      
      const starredNews = await this.prisma.bbcTechNews.findMany({
        select: {
          post: true, link: true, founded: true
        },
        orderBy: {
          founded: "desc"
        },
        where: {
          starred: "1"
        }
      });

      await this.prisma.onModuleDestroy();

      Logger.log("Founded Starred News");

      return starredNews;
    } catch (error) {
      throw new BbcError(
        "Bring Starred BBC News",
        "Failed to Bring Starred BBC News",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      )
    }

  }
}
