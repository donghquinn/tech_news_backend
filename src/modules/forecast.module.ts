import { ForeCastController } from "@controllers/climate/forecast.ctl";
import { PrismaLibrary } from "@libraries/common/prisma.lib";
import { ForeCastProvider } from "@libraries/providers/climate/forecast.lib";
import { Module } from "@nestjs/common";
import { LoggerProvider } from "@utils/logger.util";

@Module({
    controllers: [ ForeCastController ],
    providers: [ ForeCastProvider, PrismaLibrary, LoggerProvider ]
}) export class ForecastModule{}