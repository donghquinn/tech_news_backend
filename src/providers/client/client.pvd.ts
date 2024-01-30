import { ClientError } from '@errors/client.error';
import { comparePassword } from '@libraries/client/decrypt.lib';
import { cryptPassword } from '@libraries/client/encrypt.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { JwtProvider } from 'providers/auth/jwt.pvd';
import { ClientPrismaLibrary } from './client-prisma.pvd';
import { AccountManager } from './account-manager.pvd';

@Injectable()
export class ClientProvider {
  constructor(
    private readonly prisma: ClientPrismaLibrary,
    private readonly jwt: JwtProvider,
    private readonly accountManager: AccountManager,
  ) {}

  async checkEmailandSignup(email: string, password: string) {
    try {
      const result = await this.prisma.checkIsEmailExist(email);

      if (result) throw new ClientError('[SIGNUP] Check Exist User Info', 'Found Already Exist User. Reject.');

      ClientLogger.info('[Signup] Start to create user: %o', {
        email,
      });

      const { encodedPassword, passwordToken } = cryptPassword(password);

      const uuid = await this.prisma.insertNewClient(email, encodedPassword, passwordToken);

      ClientLogger.info('[Signup] Data Insert Success');

      return uuid;
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

  async login(email: string, password: string) {
    try {
      const userInfo = await this.prisma.selectUserInfo(email);

      if (userInfo === null) {
        ClientLogger.info('[Login] No Matching User Found: %o', {
          email,
        });

        throw new ClientError('[Login] Finding Matching User Info', 'No Matching User Found');
      }

      const { password: foundPassword, password_token: passwordToken, uuid } = userInfo;

      const isMatch = comparePassword(password, foundPassword, passwordToken);

      if (!isMatch) {
        ClientLogger.error('[LOGIN] Password Matching Given Password is Not Match. Reject.');

        throw new ClientError('[ LOGIN ] Password Matching ', ' Password Matching is Not Match. Reject.');
      }

      this.accountManager.setLoginUser(uuid, email);

      // await this.jwt.setRefreshToken(email, uuid, response);

      // const accessToken = await this.jwt.getAccessToken(email, uuid);

      return uuid;
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
