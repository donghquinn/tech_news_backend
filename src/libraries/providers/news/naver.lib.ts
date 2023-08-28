import { NaverError } from '@errors/naver.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable, Logger } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';

@Injectable()
export class NaverProvider {
  constructor(private prisma: PrismaLibrary) { }

  async getNaverNews(today: string) {
    try {
      const yesterday = moment(today).subtract(1, 'day').toString();

      Logger.debug("Naver YesterDay: %o", { 
        start: startOfDay(new Date(yesterday)),
        end: endOfDay(new Date(yesterday)),
      });

      const result = await this.prisma.naverNews.findMany({
        select: {
          uuid: true,
          keyWord: true,
          title: true,
          description: true,
          originallink: true,
          postedTime: true,
          founded: true,
        },
        where: {
          founded: {
            gte: startOfDay(new Date(yesterday)),
            lte: endOfDay(new Date(yesterday))
          },
        },
        orderBy: { founded: 'desc' },
      });

      await this.prisma.onModuleDestroy();

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

  async giveStar(uuid: string) {
    try {
      Logger.debug("Give Star Naver News Request: %o", {
        uuid
      });

      await this.prisma.naverNews.update({
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
      throw new NaverError(
        "Give Star on the Naver news",
        "Failed to vie star news",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      )
    }
  }

  async unStar(uuid: string) {
    try {
      Logger.debug("Give Star Naver news Request: %o", {
        uuid
      });

      await this.prisma.naverNews.update({
        data: {
          starred: "0"
        },
        where: {
          uuid
        }
      });

      await this.prisma.onModuleDestroy();

      Logger.log("Starred Updated");

      return true;
    } catch (error) {
      throw new NaverError(
        "unStar on the Naver News",
        "Failed to vie star news",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      )
    }
  }

  async bringStarredNews() {
    try {
      Logger.log("Request to get Starred Naver News");
      
      const starredNews = await this.prisma.naverNews.findMany({
        select: {
          uuid: true, title: true, url: true, founded: true
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
      throw new NaverError(
        "Bring Starred Naver News",
        "Failed to Bring Starred Naver News",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      )
    }
  }
}
