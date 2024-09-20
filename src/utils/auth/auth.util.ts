import jwt from 'jsonwebtoken';
import { JwtPayload, JwtToken } from 'types/auth.type';

export const checkPrivateMemebers = () => {
  if (process.env.JWT_KEY === undefined) return false;
  if (process.env.AES_IV === undefined) return false;

  return true;
};

export const jwtSign = (userId: string, userType: string, sessionId: string, expire: string) => {
  try {
    const validateResult = checkPrivateMemebers();

    if (!validateResult) return false;

    const payloadObj: JwtPayload = {
      userId,
      userType,
      sessionId,
    };

    return jwt.sign(payloadObj, process.env.JWT_KEY!, { algorithm: 'HS256', expiresIn: expire });
  } catch (error) {
    // console.log('JWT Error: %o', { error });

    throw Error('JWT Signing');
  }
};

export const jwtValid = (token: string): JwtToken => {
  try {
    const validateResult = checkPrivateMemebers();

    if (!validateResult) return {} as JwtToken;

    const decoded = jwt.verify(token, process.env.JWT_KEY!);

    return decoded as JwtToken;
  } catch (error) {
    // console.log('JWT Verify Error: %o', { error });

    throw new Error('JWT Verify');
  }
};
