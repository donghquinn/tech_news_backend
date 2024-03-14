import { MailerError } from '@errors/mail.error';
import { Injectable } from '@nestjs/common';
import { MailerLogger } from '@utils/logger.util';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerProvider {
  private transporter;

  private sender: string;

  constructor() {
    this.sender = process.env.GMAIL_USER!;

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: this.sender,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  private async sendMail(to: string, subject: string, content: string) {
    try {
      await this.transporter.sendMail({
        from: this.sender,
        to,
        subject,
        html: content,
      });
    } catch (error) {
      MailerLogger.error('[MAILER] Send Mail Error: %o', {
        error,
      });

      throw new MailerError(
        '[MAILER] Send Mail',
        'Send Mail Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  private static createSearchPasswordMailcontent(authKey: string): string {
    return `
      <div>
          <fieldset>
          <p>Validate Key: </p> ${authKey}
          </fieldset>
      </div>
  `;
  }

  public async sendSearchPassword(to: string, subject: string) {
    const randomKey = randomBytes(8).toString('hex');

    const content = MailerProvider.createSearchPasswordMailcontent(randomKey);

    await this.sendMail(to, subject, content);

    return randomKey;
  }

  public static createNewsdMailcontent(newsData: string): string {
    return `
    <div>
        <fieldset>
         ${newsData}
        </fieldset>
    </div>
`;
  }

  public async sendNewsMail(to: string, subject: string, newsData: string) {
    const content = MailerProvider.createNewsdMailcontent(newsData);

    await this.sendMail(to, subject, content);
  }
}
