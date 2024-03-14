import { Module } from '@nestjs/common';
import { CryptoProvider } from 'providers/crypto.pvd';

@Module({
  providers: [CryptoProvider],
  exports: [CryptoProvider],
})
export class CryptoModule {}
