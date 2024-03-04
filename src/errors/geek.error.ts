export class GeekError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Geek Error]';

    this.cause = cause;
  }
}
