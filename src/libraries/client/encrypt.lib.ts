import { createCipheriv, randomBytes } from 'crypto';

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
