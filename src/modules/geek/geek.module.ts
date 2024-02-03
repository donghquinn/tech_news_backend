import { GeekController } from '@controllers/geek/geek.ctl';
import { Module } from '@nestjs/common';
import { GeekProvider } from 'providers/news/geek/geek.pvd';
import { GeekPrismaModule } from './geek-prisma.module';

@Module({
  controllers: [GeekController],
  imports: [GeekPrismaModule],
  providers: [GeekProvider],
})
export class GeekModule {}
