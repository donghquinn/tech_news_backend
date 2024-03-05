import { ClientController } from '@controllers/client/client.ctl';
import { MailerModule } from '@modules/mailer.module';
import { Module } from '@nestjs/common';
import { ClientProvider } from 'providers/client/client.pvd';
import { AccountManagerModule } from './account.module';
import { ClientPrismaModule } from './client-prisma.module';

@Module({
  providers: [ClientProvider],
  imports: [AccountManagerModule, ClientPrismaModule, MailerModule],
  controllers: [ClientController],
})
export class ClientModule {}
