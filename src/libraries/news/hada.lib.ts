import { HadaError } from '@errors/hada.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { NewsLogger } from '@utils/logger.util';

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

export const updateLikedtoUnliked = async (prisma: PrismaLibrary, uuid: string) => {
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

export const updateNewsLiked = async (prisma: PrismaLibrary, uuid: string) => {
  try {
    NewsLogger.info('[HADA] Give Hada News Star Request: %o', {
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
