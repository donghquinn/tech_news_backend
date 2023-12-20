import { PrismaClient } from '@prisma/client';

export class PrismaLibrary extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
