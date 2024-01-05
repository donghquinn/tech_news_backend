import { MachineLearningError } from '@errors/machine.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { NewsLogger } from '@utils/logger.util';
import { endOfDay, startOfDay } from 'date-fns';
import moment from 'moment-timezone';
import { DailyMlNewsReturn } from 'types/ml.type';

export const bringMlNews = async (prisma: PrismaLibrary, today: string): Promise<Array<DailyMlNewsReturn>> => {
  try {
    const yesterday = moment(today).subtract(1, 'day').toString();

    NewsLogger.info('[ML] Latest Machine Learning News: %o', {
      start: startOfDay(new Date(yesterday)),
      end: endOfDay(new Date(yesterday)),
    });

    const result = await prisma.machineNews.findMany({
      select: {
        uuid: true,
        category: true,
        title: true,
        link: true,
        founded: true,
      },
      where: {
        founded: {
          gte: startOfDay(new Date(yesterday)),
          lte: endOfDay(new Date(yesterday)),
        },
      },
    });

    return result;
  } catch (error) {
    NewsLogger.error('[ML] Bring Daily News Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new MachineLearningError(
      '[ML] Bring Daily News',
      'Bring Daily News Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const checkMlNewsIsLiked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    const isStarred = await prisma.machineNews.findFirst({
      select: {
        liked: true,
      },
      where: {
        uuid,
      },
    });

    if (isStarred === null) throw new MachineLearningError('[ML] Get Star Info', 'No Star Info Found.');

    NewsLogger.info('[ML] Found Is Starred Info: %o', {
      isLiked: isStarred.liked,
    });

    return isStarred.liked;
  } catch (error) {
    NewsLogger.error('[ML] Check Hada News Liked Info Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new MachineLearningError(
      '[ML] Check Hada News Liked Info',
      'Check Hada News Liked Info Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const updateMlNewsLikedtoUnliked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    NewsLogger.info('[ML] Give Hada News unStar Request: %o', {
      uuid,
    });

    await prisma.machineNews.update({
      data: {
        liked: 0,
      },
      where: {
        uuid,
      },
    });

    NewsLogger.info('[ML] Unstarred Updated');

    return 0;
  } catch (error) {
    NewsLogger.error('[ML] Update Liked to UnLiked Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new MachineLearningError(
      '[ML] Update Liked to UnLiked',
      'Update Liked to UnLiked Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const updateMlNewsLiked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    NewsLogger.info('[ML] Give Hacker News Star Request: %o', {
      uuid,
    });

    await prisma.machineNews.update({
      data: {
        liked: 1,
      },
      where: {
        uuid,
      },
    });

    NewsLogger.info('[ML] Starred Updated');

    return 0;
  } catch (error) {
    NewsLogger.error('[ML] Update News Liked Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new MachineLearningError(
      '[ML] Update News Liked',
      'Update News Liked Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

// Pagination
export const getStarredMlNewsPagination = async (
  prisma: PrismaLibrary,
  page: number,
  size: number,
  userUuid: string,
) => {
  try {
    const totalPosts = await prisma.machineNews.count({ where: { liked: 1 } });

    const starredNews = await prisma.machineNews.findMany({
      select: {
        uuid: true,
        title: true,
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

    NewsLogger.info('[ML] Founded Starred News: %o', {
      totalPosts,
      newsSize: starredNews.length,
    });

    return {
      totalPosts,
      starredNews,
    };
  } catch (error) {
    NewsLogger.info('[ML] Get Starred News Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new MachineLearningError(
      '[ML] Get Starred News',
      'Get Starred News Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
