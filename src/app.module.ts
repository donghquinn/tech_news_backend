/* eslint-disable class-methods-use-this */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HeadersMiddleware } from 'middlewares/header.middleware';
import { ForecastModule } from 'modules/forecast.module';
import { MachineLearningNewsModule } from 'modules/machine.module';
import { BbcModule } from './modules/bbc.module';
import { ClimateModule } from './modules/climate.module';
import { HackerModule } from './modules/hacker.module';
import { NaverModule } from './modules/naver.module';
import { PrismaModule } from './modules/prisma.module';

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
