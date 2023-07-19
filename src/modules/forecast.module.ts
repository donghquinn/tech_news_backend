import { Module } from "@nestjs/common";
import { ForeCastController } from "controllers/climate/forecast.ctl";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import { ForeCastProvider } from "libraries/providers/climate/forecast.lib";

@Module({
    controllers: [ForeCastController],
    providers: [ForeCastProvider, PrismaLibrary]
}) export class ForecastModule{}