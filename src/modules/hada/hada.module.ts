import { HadaController } from '@controllers/hada/hada.ctl';
import { Module } from '@nestjs/common';
import { HadaProvider } from 'providers/news/hada/hada.pvd';
import { HadaPrismaModule } from './hada-prisma.module';

@Module({
  controllers: [HadaController],
  imports: [HadaPrismaModule],
  providers: [HadaProvider],
})
export class HadaModule {}
