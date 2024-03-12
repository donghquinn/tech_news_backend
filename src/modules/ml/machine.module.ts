import { MachineLearningController } from '@controllers/machine/machine.ctl';
import { AccountManagerModule } from '@modules/account.module';
import { Module } from '@nestjs/common';
import { MachineLearningProvider } from 'providers/news/ml/machine.pvd';
import { MlPrismaModule } from './ml-prisma.module';

@Module({
  controllers: [MachineLearningController],
  imports: [MlPrismaModule, AccountManagerModule],
  providers: [MachineLearningProvider],
})
export class MachineLearningNewsModule {}
