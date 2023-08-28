export class GoogleError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Google Error]';

    this.cause = cause;
  }
}
