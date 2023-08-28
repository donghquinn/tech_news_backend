export class HackerError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Hacker News Error]';

    this.cause = cause;
  }
}
