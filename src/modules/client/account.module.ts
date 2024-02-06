import { Module } from '@nestjs/common';
import { AccountManager } from 'providers/auth/account-manager.pvd';

@Module({
  providers: [AccountManager],
  exports: [AccountManager],
})
export class AccountManagerModule {}
