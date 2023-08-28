import { MachineLearningController } from "@controllers/machine/machine.ctl";
import { PrismaLibrary } from "@libraries/common/prisma.lib";
import { MachineLearningProvider } from "@libraries/providers/news/machine.lib";
import { Module } from "@nestjs/common";

@Module({
    controllers: [MachineLearningController],
    providers: [MachineLearningProvider, PrismaLibrary]
}) export class MachineLearningNewsModule{}