import { ClientController } from '@controllers/client/client.ctl';
import { ClientSearchController } from '@controllers/client/search.ctl';
import { ClientStarController } from '@controllers/client/star.ctl';
import { CryptoModule } from '@modules/crypto.module';
import { MailerModule } from '@modules/mailer.module';
import { Module } from '@nestjs/common';
import { ClientProvider } from 'providers/client/client.pvd';
import { ClientSearchProvider } from 'providers/client/search.pvd';
import { ClientStarProvider } from 'providers/client/star.pvd';
import { AccountManagerModule } from '../account.module';
import { ClientPrismaModule } from './client-prisma.module';

@Module({
  controllers: [ClientController, ClientSearchController, ClientStarController],
  providers: [ClientProvider, ClientSearchProvider, ClientStarProvider],
  imports: [AccountManagerModule, ClientPrismaModule, MailerModule, CryptoModule],
})
export class ClientModule {}
