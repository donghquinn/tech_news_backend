import { ClientError } from '@errors/client.error';
import { checkIsEmailExist } from '@libraries/client/check.lib';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';

@Injectable()
export class ClientProvider {
  constructor(private readonly prisma: PrismaLibrary) {}

  async checkEmailandSignup(email: string, password: string) {
    try
    {
      const result = await checkIsEmailExist( this.prisma, email );

      if ( result )
      {
        ClientLogger.info( "[Signup] Start to create user: %o", {
          email
        } );
        
      }
    } catch (error) {
      ClientLogger.error('[Signup] Singup New User Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new ClientError(
        '[Signup] Signup New User',
        'Signup New User Error. Please Check request again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
