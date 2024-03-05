import { Module } from '@nestjs/common';
import { MailerProvider } from 'providers/mailer.pvd';

@Module({
  providers: [MailerProvider],
  exports: [MailerProvider],
})
export class MailerModule {}
