import { MailerProvider } from 'providers/mailer.pvd';

describe('Sending Mail Validator', () => {
  const receiver = process.env.GMAIL_USER;

  test('GMAIL User must be defined', () => {
    expect(receiver).toBeDefined();
  });

  const mailer = new MailerProvider();

  test('Sending Searching Password Validate Key', async () => {
    const randomKey = await mailer.sendSearchPassword(receiver!, 'Searching Password');

    expect(randomKey).toBeDefined();
  });
});
