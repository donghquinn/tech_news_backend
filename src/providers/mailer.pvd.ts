import { MailerError } from '@errors/mail.error';
import { Injectable } from '@nestjs/common';
import { MailerLogger } from '@utils/logger.util';
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

  async sendMail(to: string, subject: string, content: string) {
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
}
