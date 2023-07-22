import { Module } from "@nestjs/common";
import { MachineLearningController } from "controllers/machine/machine.ctl";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import { MachineLearningProvider } from "libraries/providers/news/machine.lib";

@Module({
    controllers: [MachineLearningController],
    providers: [MachineLearningProvider, PrismaLibrary]
}) export class MachineLearningNewsModule{}