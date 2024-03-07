import { CryptoError } from '@errors/crypto.error';
import { ClientLogger, Logger } from '@utils/logger.util';
import { createDecipheriv } from 'crypto';
import CryptoJS from 'crypto-js';

export const decrypt = (encryptedString: string, token: string): string => {
  const secretKey = process.env.SECRET_KEY!;

  const iv = Buffer.from(token, 'hex');
  const encText = Buffer.from(encryptedString, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const decrypted = decipher.update(encText);
  const decryptedString = Buffer.concat([decrypted, decipher.final()]).toString();

  return decryptedString;
};

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
