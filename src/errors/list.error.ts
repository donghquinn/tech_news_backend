export class ListError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[List ERROR]';

    this.cause = cause;
  }
}
