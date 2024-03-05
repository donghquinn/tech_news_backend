export class PasswordError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = '[Password Error]';

    this.type = type;

    this.cause = cause;
  }
}

export class NoValidateKeyError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = '[Validate Key Error]';

    this.type = type;

    this.cause = cause;
  }
}
