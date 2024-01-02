import { HackerError } from '@errors/hacker.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { DailyHackerNewsReturn } from 'types/hackers.type';

export const bringHackerNews = async (prisma: PrismaLibrary, today: string): Promise<Array<DailyHackerNewsReturn>> => {
  try {
    const yesterday = moment(today).subtract(1, 'day').toString();

    NewsLogger.info('[Hacker] YesterDay: %o', {
      start: startOfDay(new Date(yesterday)),
      end: endOfDay(new Date(yesterday)),
    });

    const result = await prisma.hackers.findMany({
      select: { uuid: true, post: true, link: true, founded: true, liked: true },
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
    NewsLogger.error('[Hacker] Bring Daily News Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HackerError(
      '[Hacker] Bring Daily News',
      'Bring Daily News Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const checkHackerNewsIsLiked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    const isStarred = await prisma.hackers.findFirst({
      select: {
        liked: true,
      },
      where: {
        uuid,
      },
    });

    if (isStarred === null) throw new HackerError('[Hacker] Get Star Info', 'No Star Info Found.');

    NewsLogger.info('[Hacker] Found Is Starred Info: %o', {
      isLiked: isStarred?.liked,
    });

    return isStarred.liked;
  } catch (error) {
    NewsLogger.error('[Hacker] Check Hada News Liked Info Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HackerError(
      '[Hacker] Check Hada News Liked Info',
      'Check Hada News Liked Info Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const updateHackerNewsLikedtoUnliked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    NewsLogger.info('[Hacker] Give Hada News unStar Request: %o', {
      uuid,
    });

    await prisma.hackers.update({
      data: {
        liked: 0,
      },
      where: {
        uuid,
      },
    });

    NewsLogger.info('[Hacker] Unstarred Updated');

    return 0;
  } catch (error) {
    NewsLogger.error('[Hacker] Update Liked to UnLiked Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HackerError(
      '[Hacker] Update Liked to UnLiked',
      'Update Liked to UnLiked Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const updateHackerNewsLiked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    NewsLogger.info('[Hacker] Give Hacker News Star Request: %o', {
      uuid,
    });

    await prisma.hackers.update({
      data: {
        liked: 1,
      },
      where: {
        uuid,
      },
    });

    NewsLogger.info('[Hacker] Starred Updated');

    return 0;
  } catch (error) {
    NewsLogger.error('[Hacker] Update News Liked Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HackerError(
      '[Hacker] Update News Liked',
      'Update News Liked Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
