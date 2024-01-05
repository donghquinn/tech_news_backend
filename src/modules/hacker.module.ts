import { HackerController } from '@controllers/hacker/hacker.ctl';
import { Module } from '@nestjs/common';
import { HackersNewsProvider } from 'providers/news/hacker.pvd';
import { PrismaModule } from './prisma.module';

@Module({
  controllers: [HackerController],
  imports: [PrismaModule],
  providers: [HackersNewsProvider],
})
export class HackerModule {}
