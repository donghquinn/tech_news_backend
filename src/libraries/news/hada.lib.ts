import { HadaError } from '@errors/hada.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { DailyHadaNewsReturn } from 'types/hada.type';

// 뉴스 가져오는 함수
export const bringHadaNews = async (prisma: PrismaLibrary, today: string): Promise<Array<DailyHadaNewsReturn>> => {
  try {
    const yesterday = moment(today).subtract(1, 'day').toString();

    NewsLogger.info('[HadaNews] YesterDay: %o', {
      start: startOfDay(new Date(yesterday)),
      end: endOfDay(new Date(yesterday)),
    });

    const result = await prisma.hada.findMany({
      select: { uuid: true, post: true, descLink: true, founded: true, liked: true },
      where: {
        founded: {
          gte: startOfDay(new Date(yesterday)),
          lte: endOfDay(new Date(yesterday)),
        },
      },
      orderBy: { rank: 'desc' },
    });

    return result;
  } catch (error) {
    NewsLogger.error('[Hada] Bring Daily News Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HadaError(
      '[Hada] Bring Daily News',
      'Bring Daily News Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const checkHadaNewsIsLiked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    const isStarred = await prisma.hada.findFirst({
      select: {
        liked: true,
      },
      where: {
        uuid,
      },
    });

    if (isStarred === null) throw new HadaError('[Hada] Get Star Info', 'No Star Info Found.');

    NewsLogger.info('[Hada] Found Is Starred Info: %o', {
      isLiked: isStarred?.liked,
    });

    return isStarred.liked;
  } catch (error) {
    NewsLogger.error('[Hada] Check Hada News Liked Info Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HadaError(
      '[Hada] Check Hada News Liked Info',
      'Check Hada News Liked Info Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const updateHadaNewsLikedtoUnliked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    NewsLogger.info('[HADA] Give Hada News unStar Request: %o', {
      uuid,
    });

    await prisma.hada.update({
      data: {
        liked: 0,
      },
      where: {
        uuid,
      },
    });

    NewsLogger.info('[HADA] Unstarred Updated');

    return 0;
  } catch (error) {
    NewsLogger.error('[Hada] Update Liked to UnLiked Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HadaError(
      '[Hada] Update Liked to UnLiked',
      'Update Liked to UnLiked Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const updateHadaNewsLiked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    NewsLogger.info('[HADA] Give Hacker News Star Request: %o', {
      uuid,
    });

    await prisma.hada.update({
      data: {
        liked: 1,
      },
      where: {
        uuid,
      },
    });

    NewsLogger.info('[HADA] Starred Updated');

    return 0;
  } catch (error) {
    NewsLogger.error('[Hada] Update News Liked Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HadaError(
      '[Hada] Update News Liked',
      'Update News Liked Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

// Pagination
export const getStarredHadaNewsPagination = async (
  prisma: PrismaLibrary,
  page: number,
  size: number,
  userUuid: string,
) => {
  try {
    const totalPosts = await prisma.hada.count({ where: { liked: 1 } });

    const starredNews = await prisma.hada.findMany({
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
        liked: 1,
        client_id: { has: userUuid },
      },
      take: size,
      skip: (page - 1) * size,
    });

    NewsLogger.info('[Hada] Founded Starred News: %o', {
      totalPosts,
      newsSize: starredNews.length,
    });

    return {
      totalPosts,
      starredNews,
    };
  } catch (error) {
    NewsLogger.info('[Hada] Get Starred News Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HadaError(
      '[Hada] Get Starred News',
      'Get Starred News Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
