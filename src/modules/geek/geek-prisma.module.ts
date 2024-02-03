import { Module } from '@nestjs/common';
import { GeekPrismaLibrary } from 'providers/news/geek/geek-prisma.lib';

@Module({
  providers: [GeekPrismaLibrary],
  exports: [GeekPrismaLibrary],
})
export class GeekPrismaModule {}
