import { HackerError } from '@errors/hacker.error';
import { HadaError } from '@errors/hada.error';
import { MachineLearningError } from '@errors/machine.error';
import { PrismaError } from '@errors/prisma.error';
import { ValidatorError } from '@errors/validator.error';

interface ResponseObject {
  resCode: string;
  dataRes: KeyableObject | null;
  errMsg: string[];
}

interface KeyableObject {
  [key: string]: unknown;
}

export class SetResponse implements ResponseObject {
  constructor(resCode: number, data?: KeyableObject) {
    this.resCode = resCode.toString();

    this.dataRes = data ?? null;

    this.errMsg = [];
  }

  resCode: string;

  dataRes: KeyableObject | null;

  errMsg: string[];
}

export class SetErrorResponse implements ResponseObject {
  constructor(error: unknown) {
    const errorArray = [];

    if (error instanceof HackerError) {
      this.resCode = '402';
      errorArray.push(error.type, error.message);
    } else if (error instanceof HadaError) {
      this.resCode = '403';
      errorArray.push(error.type, error.message);
    } else if (error instanceof MachineLearningError) {
      this.resCode = '404';
      errorArray.push(error.type, error.message);
    } else if (error instanceof PrismaError) {
      this.resCode = '405';
      errorArray.push(error.type, error.message);
    } else if (error instanceof ValidatorError) {
      this.resCode = '406';
      errorArray.push(error.type, error.message);
    } else {
      this.resCode = '500';
      errorArray.push(String(error));
    }

    this.dataRes = null;

    this.errMsg = errorArray;
  }

  resCode: string;

  dataRes: KeyableObject | null;

  errMsg: string[];
}
