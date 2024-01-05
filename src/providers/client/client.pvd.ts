import { ClientError } from '@errors/client.error';
import { checkIsEmailExist } from '@libraries/client/check.lib';
import { createHashPassword, encryptPassword } from '@libraries/client/encrypt.lib';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { Response } from 'express';
import { JwtProvider } from 'providers/auth/jwt.pvd';

@Injectable()
export class ClientProvider {
  constructor(
    private readonly prisma: PrismaLibrary,
    private readonly jwt: JwtProvider,
  ) {}

  async checkEmailandSignup(email: string, name: string, password: string) {
    try {
      const result = await checkIsEmailExist(this.prisma, email);

      if (result) {
        ClientLogger.info('[Signup] Start to create user: %o', {
          email,
        });

        const { encodedPassword, hashToken } = encryptPassword(password);

        await this.prisma.client.create({
          data: {
            email,
            userName: name,
            password: encodedPassword,
            password_token: hashToken,
          },
        });

        ClientLogger.info('[Signup] Data Insert Success');
      }

      return 'success';
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

  async login(email: string, password: string, response: Response) {
    try {
      const userInfo = await this.prisma.client.findFirst({
        select: {
          uuid: true,
          password_token: true,
          password: true,
          isLogin: true,
        },
        where: {
          email,
        },
      });

      if (userInfo === null) {
        ClientLogger.info('[Login] No Matching User Found: %o', {
          email,
        });

        throw new ClientError('[Login] Finding Matching User Info', 'No Matching User Found');
      }

      const { password: foundPassword, password_token: passwordToken, uuid, isLogin } = userInfo;

      if (isLogin) {
        ClientLogger.error('[Login] Received User is already Logined: %o', {
          email,
        });

        throw new ClientError('[Login] Check if user is logined', 'Given User is Already Logined. Please try again.');
      }

      const encodedPassword = createHashPassword(password, passwordToken);

      if (foundPassword !== encodedPassword) {
        ClientLogger.error('[Login] Password Doesnot Match.');

        throw new ClientError('[Login] Login Password', 'Password Does not Match.');
      }

      await this.jwt.setRefreshToken(email, uuid, response);

      const accessToken = await this.jwt.getAccessToken(email, uuid);

      return accessToken;
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
