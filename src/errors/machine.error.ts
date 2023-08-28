export class MachineLearningError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Machine Learning Error]';

    this.cause = cause;
  }
}
