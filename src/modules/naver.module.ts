import { Module } from '@nestjs/common';
import { NaverController } from 'controllers/naver/naver.ctl';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import { NaverProvider } from 'libraries/providers/news/naver.lib';

@Module({ controllers: [ NaverController ], providers: [ NaverProvider, PrismaLibrary ] })
export class NaverModule { }
