import { HackerController } from '@controllers/hacker/hacker.ctl';
import { AccountManagerModule } from '@modules/client/account.module';
import { Module } from '@nestjs/common';
import { HackersNewsProvider } from 'providers/news/hacker/hacker.pvd';
import { HackerPrismaModule } from './hacker-prisma.module';

@Module({
  controllers: [HackerController],
  imports: [HackerPrismaModule, AccountManagerModule],
  providers: [HackersNewsProvider],
})
export class HackerModule {}
