export class ValidatorError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Validator Error]';

    this.cause = cause;
  }
}
