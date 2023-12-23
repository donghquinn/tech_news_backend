import { HadaController } from '@controllers/hada/hada.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { HadaProvider } from '@libraries/providers/news/hada.pvd';
import { Module } from '@nestjs/common';

@Module({
  controllers: [HadaController],
  providers: [HadaProvider, PrismaLibrary],
})
export class HadaModule {}
