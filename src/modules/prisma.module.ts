import { PrismaLibrary } from 'providers/common/prisma.lib';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaLibrary],
  exports: [PrismaLibrary],
})
export class PrismaModule {}
