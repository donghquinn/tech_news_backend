export class ClientError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Client Error]';

    this.cause = cause;
  }
}

export class NoUserError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = '[No User Error]';

    this.type = type;

    this.cause = cause;
  }
}
