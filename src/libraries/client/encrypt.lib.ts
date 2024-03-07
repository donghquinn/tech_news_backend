import { CryptoError } from '@errors/crypto.error';
import { Logger } from '@utils/logger.util';
import { createCipheriv, randomBytes } from 'crypto';
import CryptoJS from 'crypto-js';

/**
 * @param certKey 고객 인증키. 임의의 16파이트 키
 * @returns hashToken - token 필드에 들어갈 값, uuid - 고객 uuid
 */
export const cryptData = (data: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const iv = randomBytes(16); // Initialization vector
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const encrypted = cipher.update(data);

  const encryptedString = Buffer.concat([encrypted, cipher.final()]).toString('hex');

  return { encodedToken: iv.toString('hex'), encodedData: encryptedString };
};

/**
 * 비밀번호 찾기에서 원본 패스워드 암호화
 * @param originalPassword 원본 패스워드
 * @returns
 */
export const encryptOriginalPassword = (originalPassword: string): string => {
  const secretKey = process.env.CIPHER_KEY;

  try {
    if (!secretKey) {
      throw new CryptoError('[ENCRYPT] Cipher Key Validation', 'Secret key is undefined');
    }

    const bytes = CryptoJS.AES.encrypt(originalPassword, secretKey);
    const encryptedText = bytes.toString();
    // const jsoned = JSON.parse(originalText) as T;

    return encryptedText;
  } catch (error) {
    Logger.error('[ENCRYPT] Encrypt Encrypted Data Error:', {
      error,
    });

    throw new CryptoError(
      '[ENCRYPT] Encrypt encrypted data',
      'Failed to Encrypt data',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
