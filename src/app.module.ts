/* eslint-disable class-methods-use-this */
import { BbcModule } from '@modules/bbc.module';
import { ClimateModule } from '@modules/climate.module';
import { ForecastModule } from '@modules/forecast.module';
import { HackerModule } from '@modules/hacker.module';
import { MachineLearningNewsModule } from '@modules/machine.module';
import { NaverModule } from '@modules/naver.module';
import { PrismaModule } from '@modules/prisma.module';
import { Module } from '@nestjs/common';

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
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(HeadersMiddleware).forRoutes('*');
  // }
}
