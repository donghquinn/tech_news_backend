import { Module } from '@nestjs/common';
import { MlPrismaLibrary } from 'providers/news/ml/ml-prisma.lib';

@Module({
  providers: [MlPrismaLibrary],
  exports: [MlPrismaLibrary],
})
export class MlPrismaModule {}
