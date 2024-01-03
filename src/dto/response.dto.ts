import { HackerError } from '@errors/hacker.error';
import { HadaError } from '@errors/hada.error';
import { MachineLearningError } from '@errors/machine.error';
import { PrismaError } from '@errors/prisma.error';
import { ValidatorError } from '@errors/validator.error';
import { Response } from 'express';

interface ResponseObject {
  resCode: number;
  dataRes: KeyableObject | null;
  errMsg: string[];
}

interface KeyableObject {
  [key: string]: unknown;
}

export class SetResponse implements ResponseObject {
  resCode: number;

  dataRes: KeyableObject | null;

  errMsg: string[];

  constructor(resCode: number, response: Response, jwt: string, data?: KeyableObject) {
    this.resCode = resCode;

    this.dataRes = data ?? null;

    this.errMsg = [];

    response.status(this.resCode).send(jwt);

    response.json(data);
  }
}

export class SetErrorResponse implements ResponseObject {
  resCode: number;

  dataRes: KeyableObject | null;

  errMsg: string[];

  constructor(error: unknown) {
    const errorArray = [];

    if (error instanceof HackerError) {
      this.resCode = 402;
      errorArray.push(error.type, error.message);
    } else if (error instanceof HadaError) {
      this.resCode = 403;
      errorArray.push(error.type, error.message);
    } else if (error instanceof MachineLearningError) {
      this.resCode = 404;
      errorArray.push(error.type, error.message);
    } else if (error instanceof PrismaError) {
      this.resCode = 405;
      errorArray.push(error.type, error.message);
    } else if (error instanceof ValidatorError) {
      this.resCode = 406;
      errorArray.push(error.type, error.message);
    } else {
      this.resCode = 500;
      errorArray.push(String(error));
    }

    this.dataRes = null;

    this.errMsg = errorArray;
  }
}
