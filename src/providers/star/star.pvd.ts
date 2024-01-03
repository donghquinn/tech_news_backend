import { StarError } from '@errors/manager.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { NewsLogger } from '@utils/logger.util';

@Injectable()
export class StarProvider {
  constructor(private readonly prisma: PrismaLibrary) {}

  async giveHackerNewsStar(postUuid: string) {
    try {
      await this.prisma.hackers.update({
        data: {
          liked: 1,
        },
        where: {
          uuid: postUuid,
        },
      });
    } catch (error) {
      NewsLogger.info('[Hacker] Give the Hacker News Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });
      throw new StarError(
        '[Hacker] Give the news',
        'Give the Hacker News Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
