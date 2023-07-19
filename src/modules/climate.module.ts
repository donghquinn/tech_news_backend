import { Module } from '@nestjs/common';
import { ClimateController } from 'controllers/climate/climate.ctl';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import { ClimateProvider } from 'libraries/providers/climate/climate.lib';
import { LoggerProvider } from 'utils/logger.util';

@Module({
  controllers: [ ClimateController ],
  providers: [ ClimateProvider, PrismaLibrary, LoggerProvider ],
})
export class ClimateModule { }
