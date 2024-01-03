/* eslint-disable class-methods-use-this */
import { HackerModule } from '@modules/hacker.module';
import { HadaModule } from '@modules/hada.module';
import { MachineLearningNewsModule } from '@modules/machine.module';
import { PrismaModule } from '@modules/prisma.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { globalMiddleware } from 'middlewares/header.middleware';

@Module({
  imports: [HackerModule, PrismaModule, MachineLearningNewsModule, HadaModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(globalMiddleware).forRoutes('*');
  }
}
