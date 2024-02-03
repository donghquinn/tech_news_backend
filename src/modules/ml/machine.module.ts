import { MachineLearningController } from '@controllers/machine/machine.ctl';
import { Module } from '@nestjs/common';
import { MachineLearningProvider } from 'providers/news/ml/machine.pvd';
import { MlPrismaModule } from './ml-prisma.module';

@Module({
  controllers: [MachineLearningController],
  imports: [MlPrismaModule],
  providers: [MachineLearningProvider],
})
export class MachineLearningNewsModule {}
