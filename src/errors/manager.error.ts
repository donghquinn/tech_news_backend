export class AccountError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Account Error]';

    this.cause = cause;
  }
}
