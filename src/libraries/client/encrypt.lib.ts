import { ClientLogger } from '@utils/logger.util';
import { createHash, randomBytes } from 'crypto';

/**
 * @param certKey 고객 인증키. 임의의 16파이트 키
 * @returns hashToken - token 필드에 들어갈 값, uuid - 고객 uuid
 */
export const createToken = (certKey: string) => {
  const clientKey = randomBytes(16).toString('base64');

  const rawKeys = certKey + clientKey;

  const hashBase = createHash('sha256');

  const hashToken = hashBase.update(rawKeys, 'utf-8').digest('hex');

  // const uuid = v4();

  return { hashToken };
};

export const createHashPassword = (password: string, hashToken: string) => {
  const passwordBase = password + hashToken;

  const encodedPassword = createHash('sha256').update(passwordBase).digest('hex');

  return encodedPassword;
};

export const encryptPassword = (password: string) => {
  // Base Half Key
  const certKey = randomBytes(16).toString('base64');

  const { hashToken } = createToken(certKey);

  const encodedPassword = createHashPassword(password, hashToken);

  ClientLogger.debug('[SIGNIN] Encoded Password: %o', { encodedPassword });

  return { encodedPassword, hashToken };
};
