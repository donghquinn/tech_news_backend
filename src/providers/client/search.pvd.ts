import { ClientError, NoUserError } from '@errors/client.error';
import { NoValidateKeyError } from '@errors/password.error';
import { decrypt } from '@libraries/client/decrypt.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { createSearchPasswordMailcontent } from '@utils/mail.utils';
import { randomBytes } from 'crypto';
import { AccountManager } from 'providers/auth/account-manager.pvd';
import { MailerProvider } from 'providers/mailer.pvd';
import { ClientPrismaLibrary } from './client-prisma.pvd';

@Injectable()
export class ClientSearchProvider {
  constructor(
    private readonly prisma: ClientPrismaLibrary,
    private readonly accountManager: AccountManager,
    private readonly mailer: MailerProvider,
  ) {}

  async searchPassword(email: string, name: string) {
    try {
      // 찾기
      const result = await this.prisma.selectUserInfo(email, name);

      if (result === null) throw new NoUserError('[SEARCH_PASS] Search Password', 'No User Found');

      const randomKey = randomBytes(8).toString('hex');
      // const { encodedData: encodedPassword, dataToken: passwordToken } = cryptData(randomPassword);

      const mailContent = createSearchPasswordMailcontent(randomKey);

      const { password, password_token: token } = result;

      await this.accountManager.setTempData(randomKey, email, password, token);

      await this.mailer.sendMail(email, 'Search Password', mailContent);

      ClientLogger.debug('[SEARCH_PASS] Sent New Password Complete');

      return 'Sent';
    } catch (error) {
      ClientLogger.error('[SEARCH_PASS] Search Password Error: %o', {
        error,
      });

      throw new ClientError(
        '[SEARCH_PASS] Search Password',
        'Search Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async validateSearchingPasswordKey(tempKey: string) {
    try {
      // 찾기
      const tempItem = await this.accountManager.getTempData(tempKey);

      if (tempItem === null)
        throw new NoValidateKeyError('[VALIDATE_KEY] Validate Password Searching Key', 'No Matching Key Found');

      const { password, token } = tempItem;

      const rawPassword = decrypt(password, token);

      ClientLogger.debug('[VALIDATE_KEY] Validate Password Searching Key Complete');

      return rawPassword;
    } catch (error) {
      ClientLogger.error('[VALIDATE_KEY] Validate Password Searching Key Error: %o', {
        error,
      });

      throw new ClientError(
        '[VALIDATE_KEY] Validate Password Searching Key',
        'Validate Password Searching Key Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async searchEmail(name: string) {
    try {
      const result = await this.prisma.findEmail(name);

      if (result === null) throw new NoUserError('[SEARCH_EMAIL] Find Email', 'No Matching Data Found');

      const { email } = result;

      ClientLogger.debug('[SEARCH_EMAIL] Finding Email Complete');

      return email;
    } catch (error) {
      ClientLogger.error('[SEARCH_EMAIL] Finding Email Error: %o', {
        error,
      });

      throw new ClientError(
        '[SEARCH_EMAIL] Finding Email',
        'Finding Email Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
