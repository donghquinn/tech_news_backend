import { ValidatorError } from '@errors/validator.error';
import { clientSignupValidator } from '@validators/client/signup.validator';
import { ClientSignupRequest } from 'types/client.type';

describe('Signup Request Validator Test', () => {
  const request1: ClientSignupRequest = {
    name: 'Daniel',
    email: 'example@example.com',
    password: '10957239028523adscasdc',
  };

  test('Signup Validator for first Request', async () => {
    const { email, password, name } = await clientSignupValidator(request1);

    expect(email).toEqual('example@example.com');
    expect(password).toEqual('10957239028523adscasdc');
    expect(name).toEqual('Daniel');
  });

  test('Signup Validator for Second Request; Email Format Validation', async () => {
    const request2: ClientSignupRequest = {
      name: 'Daniel',
      email: 'example123',
      password: '10293745820adsc832',
    };
    try {
      await clientSignupValidator(request2);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidatorError);
    }
  });

  test('Signup Validator for Third Request; Password Length Validation', async () => {
    const request3: ClientSignupRequest = {
      name: 'Daniel',
      email: 'example123@gmail.com',
      password: '132',
    };
    try {
      await clientSignupValidator(request3);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidatorError);
    }
  });

  test('Signup Validator for Forth Request; Name Length Validation', async () => {
    const request3: ClientSignupRequest = {
      email: 'example123@gmail.com',
      password: '132',
      name: '',
    };
      
    try {
      await clientSignupValidator(request3);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidatorError);
    }
  });
});
