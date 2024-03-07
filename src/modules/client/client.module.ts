import { ClientController } from '@controllers/client/client.ctl';
import { ClientSearchController } from '@controllers/client/search.ctl';
import { ClientStarController } from '@controllers/client/star.ctl';
import { MailerModule } from '@modules/mailer.module';
import { Module } from '@nestjs/common';
import { ClientProvider } from 'providers/client/client.pvd';
import { ClientSearchProvider } from 'providers/client/search.pvd';
import { AccountManagerModule } from './account.module';
import { ClientPrismaModule } from './client-prisma.module';

@Module({
  providers: [ClientProvider, ClientSearchProvider],
  imports: [AccountManagerModule, ClientPrismaModule, MailerModule],
  controllers: [ClientController, ClientSearchController, ClientStarController],
})
export class ClientModule {}
