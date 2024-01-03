import { AuthError } from '@errors/auth.error';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class JwtProvider {
  constructor(private readonly jwt: JwtService) {}

  async getAccessToken(email: string, userUuid: string): Promise<string> {
    try {
      return await this.jwt.signAsync(
        { email, userUuid },
        { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: '5m' },
      );
    } catch (error) {
      Logger.error('[JWT] Issue Access Token Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new AuthError(
        '[JWT] Issue Access Token',
        'Issue Access Token Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async setRefreshToken(email: string, userUuid: string, response: Response) {
    try {
      const refreshToken = await this.jwt.signAsync(
        {
          email,
          userUuid,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: '2w',
        },
      );

      response.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
    } catch (error) {
      Logger.error('[JWT] Issue Refresh Token Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new AuthError(
        '[JWT] Issue Refresh Token',
        'Issue Refresh Token Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
