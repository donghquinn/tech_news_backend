import { GeekError } from '@errors/news.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class GeekPrismaLibrary extends PrismaClient {
  async bringGeekNews(startDate: Date, endDate: Date, page: number, size: number) {
    try {
      // const result = await this.client.query(
      //   `SELECT G.uuid, G.post, G.link, G.descLink, G.founded, COUNT(G.)
      //   FROM geek as G
      //   LEFT JOIN Geek_Liked as GL ON G.uuid = GL.postUuid
      //   WHERE
      //     G.founded >= ? AND G.founded <= ?
      //   ORDER BY G.rank DESC
      //   LIMIT ?
      //   OFFSET ?
      //   `,
      //   [startDate.toDateString(), endDate.toDateString(), size.toString(), ((1 - page) * size).toString()],
      // );

      // Logger.info('[QUERY] Got Query Result: %o', { result });
      const result = await this.geek.findMany({
        select: {
          uuid: true,
          post: true,
          link: true,
          descLink: true,
          founded: true,
          _count: {
            select: {
              liked_model: true,
            },
          },
        },
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { rank: 'desc' },
        take: Number(size),
        skip: (Number(page) - 1) * Number(size),
      });

      return result;
    } catch (error) {
      NewsLogger.error('[GEEK] Bring Geek News Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Bring Geek News',
        'Bring Geek News Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async geekNewsCount(startDate: Date, endDate: Date, size: number) {
    try {
      const totalCounts = await this.geek.count({
        where: {
          founded: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return Math.ceil(totalCounts / size);
    } catch (error) {
      NewsLogger.error('[GEEK] Bring Total Geek News Count Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Bring Total Geek News Count',
        'Bring Total Geek News Count Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async checkGeekNewsIsLiked(postUuid: string, clientUuid: string) {
    try {
      const isStarred = await this.geek_Liked.findFirst({
        select: {
          uuid: true,
          geek_news: {
            select: {
              uuid: true,
            },
          },
        },
        where: {
          userUuid: clientUuid,
          postUuid,
        },
      });

      if (isStarred === null) throw new GeekError('[GEEK] Get Star Info', 'No Star Info Found.');

      return isStarred;
    } catch (error) {
      NewsLogger.error('[GEEK] Check Hada News Liked Info Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Check Hada News Liked Info',
        'Check Hada News Liked Info Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async deleteGeekNewsLiked(likedUuid: string, postUuid: string, clientUuid: string) {
    try {
      NewsLogger.debug('[GEEK] Give Hada News unStar Request: %o', {
        likedUuid,
        postUuid,
        clientUuid,
      });

      await this.geek_Liked.delete({
        where: {
          uuid: likedUuid,
          userUuid: clientUuid,
          postUuid,
        },
      });

      NewsLogger.info('[GEEK] Unstarred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[GEEK] Update Liked to UnLiked Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Update Liked to UnLiked',
        'Update Liked to UnLiked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async createGeekNewsLiked(postUuid: string, clientUuid: string) {
    try {
      NewsLogger.debug('[GEEK] Give Hacker News Star Request: %o', {
        postUuid,
        clientUuid,
      });

      await this.geek_Liked.create({
        data: {
          userUuid: clientUuid,
          postUuid,
          newsPlatform: 'Geek',
        },
      });

      NewsLogger.info('[GEEK] Starred Updated');

      return 0;
    } catch (error) {
      NewsLogger.error('[GEEK] Update News Liked Error: %o', {
        error,
      });

      throw new GeekError(
        '[GEEK] Update News Liked',
        'Update News Liked Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
