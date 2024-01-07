import { MachineLearningError } from '@errors/machine.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import {
  bringMlNews,
  checkMlNewsIsLiked,
  getStarredMlNewsPagination,
  updateMlNewsLiked,
  updateMlNewsLikedtoUnliked,
} from '@libraries/news/ml.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class MachineLearningProvider {
  constructor(private readonly prisma: PrismaLibrary) {}

  async bringLatestMachineLearningNews(today: string) {
    try {
      const result = await bringMlNews(this.prisma, today);

      return result;
    } catch (error) {
      NewsLogger.error('[ML] Get Latest Machine Learning News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        'Get Latest Machine Learning News',
        'Failed to Get Latest Machine Learning News. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async giveStar(uuid: string) {
    try {
      const isLiked = await checkMlNewsIsLiked(this.prisma, uuid);

      if (!isLiked) {
        await updateMlNewsLiked(this.prisma, uuid);
      }

      if (isLiked) {
        await updateMlNewsLikedtoUnliked(this.prisma, uuid);
      }

      return true;
    } catch (error) {
      NewsLogger.error('[ML] Give Star on the ML News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        'Give Star on the ML news',
        'Failed to vie star ML news',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async bringStarredNews(page: number, size: number) {
    try {
      const pageNumber = typeof page === 'number' ? page : Number(page);
      const sizeNumber = typeof size === 'number' ? size : Number(size);

      NewsLogger.info('[ML] Request to get Starred ML News');

      const tempUserUuid = '123';

      const starredNews = await getStarredMlNewsPagination(this.prisma, pageNumber, sizeNumber, tempUserUuid);

      NewsLogger.info('[ML] Founded Starred News');

      return starredNews;
    } catch (error) {
      NewsLogger.error('[ML] Bring Starred ML News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MachineLearningError(
        'Bring Starred ML News',
        'Failed to Bring Starred ML News',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
