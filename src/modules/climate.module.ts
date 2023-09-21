import { ClimateController } from '@controllers/climate/climate.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { ClimateProvider } from '@libraries/providers/climate/climate.lib';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ClimateController],
  providers: [ClimateProvider, PrismaLibrary],
})
export class ClimateModule {}
