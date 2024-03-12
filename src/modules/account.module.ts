import { Module } from '@nestjs/common';
import { AccountManager } from 'providers/account-manager.pvd';

@Module({
  providers: [AccountManager],
  exports: [AccountManager],
})
export class AccountManagerModule {}
