export class RedisError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = 'Redis Error';

    this.cause = cause;
  }
}
