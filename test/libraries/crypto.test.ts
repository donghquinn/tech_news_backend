import { CryptoProvider } from 'providers/crypto.pvd';

describe('Encrypt Password', () => {
  describe('Check ENV', () => {
    const key = process.env.SECRET_KEY;

    expect(key).toBeDefined();
  });

  describe('Encrypt Password and Decrypt it', () => {
    const password = '12345asdc';

    const crypto = new CryptoProvider();

    const { encodedData, encodedToken } = crypto.cryptData(password);

    const decryptPassword = crypto.decrypt(encodedData, encodedToken);

    test('Encoded Password should be decripted', () => {
      expect(decryptPassword).toEqual(password);
    });
  });
});
