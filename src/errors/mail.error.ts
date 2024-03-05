export class MailerError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Mailer Error]';

    this.cause = cause;
  }
}
