export class ClientError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Client Error]';

    this.cause = cause;
  }
}
