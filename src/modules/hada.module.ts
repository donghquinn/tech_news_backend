import { HadaController } from '@controllers/hada/hada.ctl';
import { Module } from '@nestjs/common';
import { HadaProvider } from 'providers/news/hada/hada.pvd';
import { PrismaModule } from './prisma.module';

@Module({
  controllers: [HadaController],
  imports: [PrismaModule],
  providers: [HadaProvider],
})
export class HadaModule {}
