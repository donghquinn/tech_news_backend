import { NaverController } from '@controllers/naver/naver.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { NaverProvider } from '@libraries/providers/news/naver.lib';
import { Module } from '@nestjs/common';
import { LoggerProvider } from '@utils/logger.util';

@Module({
  controllers: [NaverController],
  providers: [NaverProvider, PrismaLibrary, LoggerProvider],
})
export class NaverModule {}
