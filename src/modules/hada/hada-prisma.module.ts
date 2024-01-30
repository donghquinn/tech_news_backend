import { Module } from '@nestjs/common';
import { HadaPrismaLibrary } from 'providers/news/hada/hada-prisma.lib';

@Module({
  providers: [HadaPrismaLibrary],
  exports: [HadaPrismaLibrary],
})
export class HadaPrismaModule {}
