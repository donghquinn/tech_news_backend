import { ClientError, NoUserError } from '@errors/client.error';
import { NoValidateKeyError, PasswordError } from '@errors/password.error';
import { comparePassword, decrypt, decryptPassword } from '@libraries/client/decrypt.lib';
import { cryptData, encryptOriginalPassword } from '@libraries/client/encrypt.lib';
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

      const encryptedPassword = encryptOriginalPassword(rawPassword);

      ClientLogger.debug('[VALIDATE_KEY] Validate Password Searching Key Complete');

      return encryptedPassword;
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

  async changeSearchingPassword(email: string, name: string, password: string, newPassword: string) {
    try {
      // 찾기
      const result = await this.prisma.findUser(email, name);

      if (result === null) {
        ClientLogger.error('[CHANGE_PASS] Error. No matching User Found.: %o', {
          email,
        });

        throw new NoUserError('[CHANGE_PASS] Login', 'No Matching Info. Please Make sure you Logged Out Before.');
      }

      const decryptedPassword = decryptPassword(password);

      const { password: dbPassword, password_token: token, uuid } = result;

      const dbRawPassword = decrypt(dbPassword, token);

      if (decryptedPassword !== dbRawPassword)
        throw new PasswordError('[CHANGE_PASS] Changing Password', 'Password Is Not Match');

      const decryptedNewPassword = decryptPassword(newPassword);

      const { encodedData: encodedNewPassword, encodedToken: passwordNewToken } = cryptData(decryptedNewPassword);

      await this.prisma.updateNewPassword(uuid, encodedNewPassword, passwordNewToken);

      ClientLogger.debug('[CHANGE_PASS] Changing Password Complete');

      return 'success';
    } catch (error) {
      ClientLogger.error('[CHANGE_PASS] Change Password Error: %o', {
        error,
      });

      throw new ClientError(
        '[CHANGE_PASS] Change Password',
        'Change Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async changePassword(encodedEmail: string, password: string, newPassword: string) {
    try {
      const loginInfo = await this.accountManager.getItem(encodedEmail);

      if (loginInfo === null) throw new NoUserError('[CHANGE_PASS] Change Password', 'No User Data Found');

      const { token: emailToken } = loginInfo;

      const email = decrypt(encodedEmail, emailToken);

      // 찾기
      const result = await this.prisma.findUser(email);

      if (result === null) {
        ClientLogger.error('[CHANGE_PASS] Error. No matching User Found.: %o', {
          email,
        });

        throw new NoUserError('[CHANGE_PASS] Login', 'No Matching Info. Please Make sure you Logged Out Before.');
      }

      const { password: dbPassword, password_token: token, uuid } = result;

      const isMatch = comparePassword(password, dbPassword, token);

      if (!isMatch) throw new PasswordError('[CHANGE_PASS] Changing Password', 'Password Is Not Match');

      const { encodedData: encodedPassword, encodedToken: passwordToken } = cryptData(newPassword);

      await this.prisma.updateNewPassword(uuid, encodedPassword, passwordToken);

      ClientLogger.debug('[CHANGE_PASS] Changing Password Complete');

      return 'success';
    } catch (error) {
      ClientLogger.error('[CHANGE_PASS] Change Password Error: %o', {
        error,
      });

      throw new ClientError(
        '[CHANGE_PASS] Change Password',
        'Change Password Error',
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
