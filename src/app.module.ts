/* eslint-disable class-methods-use-this */
import { ClientModule } from '@modules/client/client.module';
import { HackerModule } from '@modules/hacker/hacker.module';
import { GeekModule } from '@modules/geek/geek.module';
import { MachineLearningNewsModule } from '@modules/ml/machine.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { globalMiddleware } from 'middlewares/header.middleware';

@Module({
  imports: [HackerModule, MachineLearningNewsModule, GeekModule, ClientModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(globalMiddleware).forRoutes('*');
  }
}
