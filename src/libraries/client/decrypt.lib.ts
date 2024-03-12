import { CryptoError } from '@errors/crypto.error';
import { ClientLogger, Logger } from '@utils/logger.util';
import { createDecipheriv } from 'crypto';
import CryptoJS from 'crypto-js';

/**
 * 복호화
 * 
 * @param encryptedString 복호화 할 암호화 된 문자열
 * @param token 복화에 사용할 비대칭 키(토큰)
 * @returns 복호화 된 문자열
 */
export const decrypt = (encryptedString: string, token: string): string => {
  const secretKey = process.env.SECRET_KEY!;

  const iv = Buffer.from(token, 'hex');
  const encText = Buffer.from(encryptedString, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const decrypted = decipher.update(encText);
  const decryptedString = Buffer.concat([decrypted, decipher.final()]).toString();

  return decryptedString;
};


/**
 * 비밀번호 암호화 된 문자열과 복호화 된 문자열 비교 함수
 * @param receivedPassword 수신된 패스워드
 * @param encodedPassword 회원가입 때 DB에 저장된 암호화 된 패스워드
 * @param passwordToken 회원가입할 때 암호화하여 DB에 저장된 복호화 키(토큰)
 * @returns boolean값
 */
export const comparePassword = (receivedPassword: string, encodedPassword: string, passwordToken: string): boolean => {
  const decryptedPassword = decrypt(encodedPassword, passwordToken);

  ClientLogger.debug('[COMPARE] Compare Decrypted Password: %o', {
    receivedPassword,
    decryptedPassword,
  });

  return receivedPassword === decryptedPassword;
};

/**
 *
 * @param encryptedData 암호화 된 원본 패스워드 복호화
 * @returns 원본 패스워드
 */
export const decryptPassword = (encryptedData: string): string => {
  const secretKey = process.env.CIPHER_KEY;

  try {
    if (!secretKey) {
      throw new CryptoError('[DECRYPT] Cipher Key Validation', 'Secret key is undefined');
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
  } catch (error) {
    Logger.error('[DECRYPT] Decrypt Encrypted Data Error:', {
      error,
    });

    throw new CryptoError(
      '[DECRYPT] Decrypt encrypted data',
      'Failed to decrypt data',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
