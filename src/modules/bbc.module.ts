import { BbcController } from '@controllers/bbc/bbc.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { BbcNewsProvider } from '@libraries/providers/news/bbc.lib';
import { Module } from '@nestjs/common';
import { LoggerProvider } from '@utils/logger.util';

@Module({
  controllers: [BbcController],
  providers: [BbcNewsProvider, PrismaLibrary, LoggerProvider],
})
export class BbcModule {}
