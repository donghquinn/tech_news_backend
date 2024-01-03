import { ClientError } from '@errors/client.error';
import { checkIsEmailExist } from '@libraries/client/check.lib';
import { encryptPassword } from '@libraries/client/encrypt.lib';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { resolve } from 'path';

@Injectable()
export class ClientProvider {
  constructor(private readonly prisma: PrismaLibrary) {}

  async checkEmailandSignup(email: string, name: string, password: string) {
    try
    {
      const result = await checkIsEmailExist( this.prisma, email );

      if ( result )
      {
        ClientLogger.info( "[Signup] Start to create user: %o", {
          email
        } );
    
        const {encodedPassword, hashToken} = encryptPassword( password );

        await this.prisma.client.create( {
          data: {
            email,
            userName: name,
            password: encodedPassword,
            password_token: hashToken,
          }
        } )
        
        ClientLogger.info('[Signup] Data Insert Success');
      }

      return "success";
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

  async login ( email: string, password: string )
  {
    try
    {
      const userInfo = await this.prisma.client.findFirst( {
        select: {
          password_token: true,
          password: true,
          isLogin: true
        }, where: {
          email,
        }
      } )
      
      if ( userInfo === null )
      {
        ClientLogger.info( "[Login] No Matching User Found: %o", {
          email,
        } )
        
        throw new ClientError( "[Login] Finding Matching User Info", "No Matching User Found" );
      }
    } catch (error) {
      ClientLogger.error('[Login] Login Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new ClientError(
        '[Login] Login',
        'Login Error. Please try again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
