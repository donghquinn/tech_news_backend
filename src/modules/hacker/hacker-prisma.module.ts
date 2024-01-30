import { Module } from '@nestjs/common';
import { HackerPrismaLibrary } from 'providers/news/hacker/hacker-prisma.lib';

@Module({
  providers: [HackerPrismaLibrary],
  exports: [HackerPrismaLibrary],
})
export class HackerPrismaModule {}
