import { MachineLearningController } from '@controllers/machine/machine.ctl';
import { Module } from '@nestjs/common';
import { MachineLearningProvider } from 'providers/news/ml/machine.pvd';
import { PrismaModule } from './prisma.module';

@Module({
  controllers: [MachineLearningController],
  imports: [PrismaModule],
  providers: [MachineLearningProvider],
})
export class MachineLearningNewsModule {}
