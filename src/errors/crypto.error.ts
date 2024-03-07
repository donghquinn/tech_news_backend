export class CryptoError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Crypto Error]';

    this.cause = cause;
  }
}
