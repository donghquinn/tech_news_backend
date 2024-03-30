import { CryptoError } from '@errors/crypto.error';
import { Injectable } from '@nestjs/common';
import { CryptoLogger } from '@utils/logger.util';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class CryptoProvider {
  private secretKey: string;

  private cipherKey: string;

  constructor() {
    this.secretKey = process.env.SECRET_KEY!;

    this.cipherKey = process.env.CIPHER_KEY!;
  }

  /**
   * 비밀번호 암호화 된 문자열과 복호화 된 문자열 비교 함수
   * @param receivedPassword 수신된 패스워드
   * @param encodedPassword 회원가입 때 DB에 저장된 암호화 된 패스워드
   * @param passwordToken 회원가입할 때 암호화하여 DB에 저장된 복호화 키(토큰)
   * @returns boolean값
   */
  public comparePassword(receivedPassword: string, encodedPassword: string, passwordToken: string): boolean {
    try {
      const decryptedPassword = this.decrypt(encodedPassword, passwordToken);

      return receivedPassword === decryptedPassword;
    } catch (error) {
      CryptoLogger.error('[COMPARE] Comparing Encrypted - Decrypted Password: %o', {
        error,
      });

      throw new CryptoError(
        '[COMPARE] Comparing Encrypted - Decrypted Password',
        'Comparing Password got error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public decrypt(encryptedString: string, token: string): string {
    if (this.secretKey === undefined || !this.secretKey)
      throw new CryptoError('[ENCRYPT] Decrypt Data Key Validation', 'Secret key is undefined');

    try {
      const iv = Buffer.from(token, 'hex');
      const encText = Buffer.from(encryptedString, 'hex');

      const decipher = createDecipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);

      const decrypted = decipher.update(encText);
      const decryptedString = Buffer.concat([decrypted, decipher.final()]).toString();

      return decryptedString;
    } catch (error) {
      CryptoLogger.error('[DECRYPT] Decrypt Data Error: %o', {
        error,
      });

      throw new CryptoError(
        '[DECRYPT] Decrypt Data',
        'Decrypt Data Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  /**
   *
   * @param encryptedData 암호화 된 원본 패스워드 복호화
   * @returns 원본 패스워드
   */
  public decryptPassword(encryptedData: string): string {
    if (this.cipherKey === undefined || !this.cipherKey)
      throw new CryptoError('[DECRYPT] Decrypt Password Key Validation', 'Cipher key is undefined');

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.cipherKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      return originalText;
    } catch (error) {
      CryptoLogger.error('[DECRYPT] Decrypt Password Error:', {
        error,
      });

      throw new CryptoError(
        '[DECRYPT] Decrypt encrypted data',
        'Failed to decrypt data',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  /**
   * 문자열 암호화 함수
   * @param certKey 고객 인증키. 임의의 16파이트 키
   * @returns hashToken - token 필드에 들어갈 값, uuid - 고객 uuid
   */
  public cryptData(data: string) {
    if (this.secretKey === undefined || !this.secretKey)
      throw new CryptoError('[ENCRYPT] Encrypt Data Key Validation', 'Secret key is undefined');

    try {
      const iv = randomBytes(16); // Initialization vector
      const cipher = createCipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);

      const encrypted = cipher.update(data);

      const encryptedString = Buffer.concat([encrypted, cipher.final()]).toString('hex');

      const returnData = {
        encodedToken: iv.toString('hex'),
        encodedData: encryptedString,
      };

      return returnData;
    } catch (error) {
      CryptoLogger.error('[ENCRYPT] Encrypt Data Error: %o', {
        error,
      });

      throw new CryptoError(
        '[ENCRYPT] Encrypt Data',
        'Encrypt Data Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  /**
   * 비밀번호 찾기에서 원본 패스워드 암호화
   * @param originalPassword 원본 패스워드
   * @returns
   */
  encryptOriginalPassword(originalPassword: string): string {
    try {
      if (this.cipherKey === undefined || !this.cipherKey)
        throw new CryptoError('[ENCRYPT] Encrypt Password Key Validation', 'Cipher key is undefined');

      const bytes = CryptoJS.AES.encrypt(originalPassword, this.cipherKey);
      const encryptedText = bytes.toString();
      // const jsoned = JSON.parse(originalText) as T;

      return encryptedText;
    } catch (error) {
      CryptoLogger.error('[ENCRYPT] Encrypt Password Error:', {
        error,
      });

      throw new CryptoError(
        '[ENCRYPT] Encrypt encrypted data',
        'Failed to Encrypt data',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
