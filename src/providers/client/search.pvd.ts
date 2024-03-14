import { NoUserError } from '@errors/client.error';
import { NoValidateKeyError, PasswordError } from '@errors/password.error';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { AccountManager } from 'providers/account-manager.pvd';
import { CryptoProvider } from 'providers/crypto.pvd';
import { MailerProvider } from 'providers/mailer.pvd';
import { ClientPrismaLibrary } from './client-prisma.pvd';

@Injectable()
export class ClientSearchProvider {
  constructor(
    private readonly prisma: ClientPrismaLibrary,
    private readonly accountManager: AccountManager,
    private readonly crypto: CryptoProvider,
    private readonly mailer: MailerProvider,
  ) {}

  /**
   * 유저 패스워드 찾기 함수. 받은 유저 정보를 DB에서 찾고 인증키를 메일로 전송.
   * 메일 전송 후 인증키를 REDIS에 등록하고, 유저는 메일에서 검증키 전송
   * @param email 유저 이메일
   * @param name 유저 이름
   * @returns 전송 성공 메세지
   */
  async searchPassword(email: string, name: string) {
    // 찾기
    const result = await this.prisma.selectUserInfo(email, name);

    if (result === null) throw new NoUserError('[SEARCH_PASS] Search Password', 'No User Found');
    // const { encodedData: encodedPassword, dataToken: passwordToken } = cryptData(randomPassword);

    const { password, password_token: token } = result;

    const randomKey = await this.mailer.sendSearchPassword(email, 'Search Password');
    await this.accountManager.setTempData(randomKey, email, password, token);

    ClientLogger.info('[SEARCH_PASS] Sending New Password Complete');

    return 'Sent';
  }

  /**
   * 비밀번호 찾기에서 전송된 검증키를 전달 받아, 유저 검증
   * @param tempKey 메일로 전송된 검증키
   * @returns 암호화 된 패스워드 전송. 프론트단에서 복호화 실시
   */
  async validateSearchingPasswordKey(tempKey: string) {
    // 찾기
    const tempItem = await this.accountManager.getTempData(tempKey);

    if (tempItem === null)
      throw new NoValidateKeyError('[VALIDATE_KEY] Validate Password Searching Key', 'No Matching Key Found');

    const { password, token } = tempItem;

    const rawPassword = this.crypto.decrypt(password, token);

    const encryptedPassword = this.crypto.encryptOriginalPassword(rawPassword);

    ClientLogger.info('[VALIDATE_KEY] Validate Password Searching Key Complete');

    return encryptedPassword;
  }

  /**
   * 비밀번호 변경
   * @param email 유저 이메일
   * @param name 유저 이름
   * @param password 이전 패스워드
   * @param newPassword 새로운 패스워드
   * @returns 성공 여부 메세지
   */
  async changeSearchingPassword(email: string, name: string, password: string, newPassword: string) {
    // 찾기
    const result = await this.prisma.findUser(email, name);

    if (result === null) {
      ClientLogger.error('[CHANGE_PASS] Error. No matching User Found.: %o', {
        email,
      });

      throw new NoUserError('[CHANGE_PASS] Login', 'No Matching Info. Please Make sure you Logged Out Before.');
    }

    const decryptedPassword = this.crypto.decryptPassword(password);

    const { password: dbPassword, password_token: token, uuid } = result;

    const dbRawPassword = this.crypto.decrypt(dbPassword, token);

    if (decryptedPassword !== dbRawPassword)
      throw new PasswordError('[CHANGE_PASS] Changing Password', 'Password Is Not Match');

    const decryptedNewPassword = this.crypto.decryptPassword(newPassword);

    const { encodedData: encodedNewPassword, encodedToken: passwordNewToken } =
      this.crypto.cryptData(decryptedNewPassword);

    await this.prisma.updateNewPassword(uuid, encodedNewPassword, passwordNewToken);

    ClientLogger.info('[CHANGE_PASS] Changing Password Complete');

    return 'success';
  }

  /**
   * 로그인한 유저가 패스워드 변경 요청할 때 호출되는 함수.
   * REDIS에서 로그인 유저 찾고, 패스워드 변경
   * @param encodedEmail 인코딩 된 유저 이메일
   * @param password 이전 패스워드
   * @param newPassword 새로운 패스워드
   * @returns 성공 여부 메세지
   */
  async changePassword(encodedEmail: string, password: string, newPassword: string) {
    const loginInfo = await this.accountManager.getItem(encodedEmail);

    if (loginInfo === false) throw new NoUserError('[CHANGE_PASS] Change Password', 'No User Data Found');

    const { token: emailToken } = loginInfo;

    const email = this.crypto.decrypt(encodedEmail, emailToken);

    // 찾기
    const result = await this.prisma.findUser(email);

    if (result === null) {
      ClientLogger.error('[CHANGE_PASS] Error. No matching User Found.: %o', {
        email,
      });

      throw new NoUserError('[CHANGE_PASS] Login', 'No Matching Info. Please Make sure you Logged Out Before.');
    }

    const { password: dbPassword, password_token: token, uuid } = result;

    const isMatch = this.crypto.comparePassword(password, dbPassword, token);

    if (!isMatch) throw new PasswordError('[CHANGE_PASS] Changing Password', 'Password Is Not Match');

    const { encodedData: encodedPassword, encodedToken: passwordToken } = this.crypto.cryptData(newPassword);

    await this.prisma.updateNewPassword(uuid, encodedPassword, passwordToken);

    ClientLogger.info('[CHANGE_PASS] Changing Password Complete');

    return 'success';
  }

  /**
   * 이메일 찾기
   * @param name 유저 이름
   * @returns 유저 이메일
   */
  async searchEmail(name: string) {
    const result = await this.prisma.findEmail(name);

    if (result === null) throw new NoUserError('[SEARCH_EMAIL] Find Email', 'No Matching Data Found');

    const { email } = result;

    ClientLogger.debug('[SEARCH_EMAIL] Finding Email Complete');

    return email;
  }
}
