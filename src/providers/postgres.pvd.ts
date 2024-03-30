import { QueryError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { Logger } from '@utils/logger.util';
import { Client } from 'pg';

@Injectable()
export class DatabaseProvider {
  private user: string;

  private password: string;

  private port: number;

  private host: string;

  private database: string;

  private client: Client;

  constructor() {
    this.user = process.env.POSTGRES_USER!;
    this.password = process.env.POSTGRES_PASSWORD!;
    this.port = Number(process.env.POSTGRES_PORT);
    this.database = process.env.POSTGRES_DB!;
    this.host = process.env.POSTGRES_HOST!;

    this.client = new Client({
      user: this.user,
      password: this.password,
      port: this.port,
      host: this.host,
      database: this.database,
    });
  }

  async start() {
    try {
      await this.client.connect();

      Logger.info('[START] Check DataBase Connection Success');
    } catch (error) {
      Logger.error('[START] Check Database Connection Error: %o', { error });

      throw new QueryError(
        '[START] Check Database Connection',
        'Check DataBase Connection Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async query(query: string, param: Array<string>) {
    try {
      const result = await this.client.query(query, param);

      return result;
    } catch (error) {
      Logger.error('[QUERY] Query to Database Error: %o', { error });

      throw new QueryError(
        '[QUERY] Query to Database',
        'Query Got Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async stop() {
    try {
      await this.client.end();
    } catch (error) {
      Logger.error('[STOP] Stop Database Connection Error: %o', { error });

      throw new QueryError(
        '[STOP] Stop Database Connection',
        'Stop Database Connection Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
