import { NaverController } from '@controllers/naver/naver.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { NaverProvider } from '@libraries/providers/news/naver.pvd';
import { Module } from '@nestjs/common';

@Module({
  controllers: [NaverController],
  providers: [NaverProvider, PrismaLibrary],
})
export class NaverModule {}
