import { BbcError } from '@errors/bbc.error';
import { HackerError } from '@errors/hacker.error';
import { MelonError } from '@errors/melon.error';
import { NaverError } from '@errors/naver.error';

interface ResponseObject {
  resCode: string;
  dataRes: KeyableObject | null;
  errMsg: string[];
}

interface KeyableObject {
  [key: string]: unknown;
}

export class SetResponse implements ResponseObject {
  constructor(res: number, data?: KeyableObject) {
    this.resCode = res.toString();

    this.dataRes = data ?? null;

    this.errMsg = [];
  }

  resCode: string;

  dataRes: KeyableObject | null;

  errMsg: string[];
}

export class SetErrorResponse implements ResponseObject {
  constructor(res: number, error: unknown) {
    const errorArray = [];

    if (error instanceof BbcError) {
      errorArray.push(error.type, error.message);
    }

    if (error instanceof HackerError) {
      errorArray.push(error.type, error.message);
    }

    if (error instanceof MelonError) {
      errorArray.push(error.type, error.message);
    }

    if (error instanceof NaverError) {
      errorArray.push(error.type, error.message);
    }

    if (typeof error === 'string') errorArray.push(error);

    if (Array.isArray(error)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      errorArray.push(...error);
    }

    this.resCode = res.toString();

    this.dataRes = null;

    this.errMsg = errorArray;
  }

  resCode: string;

  dataRes: KeyableObject | null;

  errMsg: string[];
}
