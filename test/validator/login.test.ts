import { ValidatorError } from '@errors/validator.error';
import { clientLoginValidator } from '@validators/client/login.validator';
import { ClientLoginRequest } from 'types/client.type';

describe('Login Request Validator Test', () => {
  const request1: ClientLoginRequest = {
    email: 'example@example.com',
    password: '10957239028523adscasdc',
  };

  test('Login Validator for first Request', async () => {
    const { email, password } = await clientLoginValidator(request1);

    expect(email).toEqual('example@example.com');
    expect(password).toEqual('10957239028523adscasdc');
  });

  test('Login Validator for Second Request; Email Format Validation', async () => {
    const request2: ClientLoginRequest = {
      email: 'example123',
      password: '10293745820adsc832',
    };
    try {
      await clientLoginValidator(request2);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidatorError);
    }
  });

  test('Login Validator for Third Request; Password Length Validation', async () => {
    const request3: ClientLoginRequest = {
      email: 'example123@gmail.com',
      password: '132',
    };
    try {
      await clientLoginValidator(request3);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidatorError);
    }
  });
});
