import { ClientController } from '@controllers/client/client.ctl';
import { Module } from '@nestjs/common';
import { ClientProvider } from 'providers/client/client.pvd';
import { AccountManagerModule } from './account.module';
import { ClientPrismaModule } from './client-prisma.module';

@Module({
  providers: [ClientProvider],
  imports: [AccountManagerModule, ClientPrismaModule],
  controllers: [ClientController],
})
export class ClientModule {}
