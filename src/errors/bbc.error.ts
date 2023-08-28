export class BbcError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[BBC Error]';

    this.cause = cause;
  }
}
