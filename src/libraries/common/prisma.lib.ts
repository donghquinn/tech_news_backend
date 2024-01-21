import { PrismaError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class PrismaLibrary extends PrismaClient {
  async bringHadaNews(startDate: Date, endDate: Date) {
    try {
      const result = await this.hada.findMany({
        select: { uuid: true, post: true, descLink: true, founded: true, liked: true },
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { rank: 'desc' },
      });

      return result;
    } catch (error) {
      NewsLogger.error('[HADA] Bring Geek News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new PrismaError(
        '[HADA] Bring Geek News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringMlNews(startDate: Date, endDate: Date) {
    try {
      const result = await this.machineNews.findMany({
        select: {
          uuid: true,
          category: true,
          title: true,
          link: true,
          founded: true,
        },
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return result;
    } catch (error) {
      NewsLogger.error('[ML] Bring Geek News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new PrismaError(
        '[ML] Bring Geek News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringHackerNews(startDate: Date, endDate: Date) {
    try {
      const result = await this.hackers.findMany({
        select: { uuid: true, post: true, link: true, founded: true, liked: true },
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { rank: 'desc' },
      });

      return result;
    } catch (error) {
      NewsLogger.error('[ML] Bring Geek News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new PrismaError(
        '[ML] Bring Geek News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
