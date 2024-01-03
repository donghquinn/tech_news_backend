export class AuthError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Auth ERROR]';

    this.cause = cause;
  }
}
