import { HackerController } from '@controllers/hacker/hacker.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { HackersNewsProvider } from 'providers/news/hacker.pvd';
import { Module } from '@nestjs/common';

@Module({
  controllers: [HackerController],
  providers: [HackersNewsProvider, PrismaLibrary],
})
export class HackerModule {}
