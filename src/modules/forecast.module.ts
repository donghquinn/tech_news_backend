import { ForeCastController } from '@controllers/climate/forecast.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { ForeCastProvider } from 'providers/climate/forecast.pvd';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ForeCastController],
  providers: [ForeCastProvider, PrismaLibrary],
})
export class ForecastModule {}
