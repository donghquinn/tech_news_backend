export class StatisticsError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Statistics Error]';

    this.cause = cause;
  }
}
