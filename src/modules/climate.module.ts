import { Module } from '@nestjs/common';
import { ClimateController } from 'controllers/climate/climate.ctl';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import { ClimateProvider } from 'libraries/providers/climate/climate.lib';

@Module({
  controllers: [ ClimateController ],
  providers: [ ClimateProvider, PrismaLibrary ],
})
export class ClimateModule { }
