import { ClientLogger } from '@utils/logger.util';
import { createDecipheriv } from 'crypto';

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
