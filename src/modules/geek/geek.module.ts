import { GeekController } from '@controllers/geek/geek.ctl';
import { AccountManagerModule } from '@modules/account.module';
import { Module } from '@nestjs/common';
import { GeekProvider } from 'providers/news/geek/geek.pvd';
import { GeekPrismaModule } from './geek-prisma.module';

@Module({
  controllers: [GeekController],
  imports: [GeekPrismaModule, AccountManagerModule],
  providers: [GeekProvider],
})
export class GeekModule {}
