export class StarError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Star Error]';

    this.cause = cause;
  }
}
