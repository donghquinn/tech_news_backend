import { MachineLearningController } from '@controllers/machine/machine.ctl';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { MachineLearningProvider } from 'providers/news/machine.pvd';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MachineLearningController],
  providers: [MachineLearningProvider, PrismaLibrary],
})
export class MachineLearningNewsModule {}
