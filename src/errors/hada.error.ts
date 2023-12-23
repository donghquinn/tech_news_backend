export class HadaError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Hada Error]';

    this.cause = cause;
  }
}
