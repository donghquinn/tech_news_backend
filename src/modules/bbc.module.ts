import { BbcController } from '@controllers/bbc/bbc.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { BbcNewsProvider } from '@libraries/providers/news/bbc.pvd';
import { Module } from '@nestjs/common';

@Module({
  controllers: [BbcController],
  providers: [BbcNewsProvider, PrismaLibrary],
})
export class BbcModule {}
