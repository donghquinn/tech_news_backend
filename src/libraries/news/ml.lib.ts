import { MachineLearningError } from '@errors/machine.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { NewsLogger } from '@utils/logger.util';

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
