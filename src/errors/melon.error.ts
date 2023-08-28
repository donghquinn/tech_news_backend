export class MelonError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Melon Error]';

    this.cause = cause;
  }
}
