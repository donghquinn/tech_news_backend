export class GeekError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Geek Error]';

    this.cause = cause;
  }
}

export class HackerError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Hacker News Error]';

    this.cause = cause;
  }
}

export class MachineLearningError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Machine Learning Error]';

    this.cause = cause;
  }
}
