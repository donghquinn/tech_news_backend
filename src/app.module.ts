/* eslint-disable class-methods-use-this */
import { BbcModule } from '@modules/bbc.module';
import { ClimateModule } from '@modules/climate.module';
import { ForecastModule } from '@modules/forecast.module';
import { HackerModule } from '@modules/hacker.module';
import { MachineLearningNewsModule } from '@modules/machine.module';
import { NaverModule } from '@modules/naver.module';
import { PrismaModule } from '@modules/prisma.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HeadersMiddleware } from 'middlewares/header.middleware';

@Module({
  imports: [
    HackerModule,
    BbcModule,
    PrismaModule,
    ClimateModule,
    NaverModule,
    ForecastModule,
    MachineLearningNewsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeadersMiddleware).forRoutes('*');
  }
}
