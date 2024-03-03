import { RedisError } from '@errors/redis.error';
import { Injectable } from '@nestjs/common';
import { ClientLogger, ManagerLogger } from '@utils/logger.util';
import { RedisClientType, createClient } from 'redis';
import { ClientLoginItem } from 'types/client.type';

@Injectable()
export class AccountManager {
  private redis: RedisClientType;

  private keyList: Array<string>;

  constructor() {
    // eslint-disable-next-line max-len
    // this.redisUrl = `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

    this.redis = createClient({
      url: process.env.REDIS_HOST,
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASS,
    });

    this.keyList = [];
  }

  public async start() {
    try {
      await this.redis.connect();

      ManagerLogger.info('[START] Redis Connected');
    } catch (error) {
      ManagerLogger.error('[START] Redis Connected Error: %o', {
        error,
      });

      throw new RedisError(
        '[START] Redis Connected',
        'Redis Connected Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  /**
   *
   * @param clientUuid
   * @param email
   * @param password
   * @returns
   */

  public async deleteItem(encodedEmail: string) {
    try {
      const index = this.keyList.findIndex((item) => item === encodedEmail);

      if (index > -1) {
        this.keyList.splice(index, 1);
        await this.redis.connect();
        await this.redis.del(encodedEmail);
        await this.redis.disconnect();
        ManagerLogger.info('[DELETE] Deleted User Info from Key List and Cache Data');
      }
    } catch (error) {
      ManagerLogger.error('[DELETE] Delete User Item Error: %o', {
        error,
      });

      throw new RedisError(
        '[DELETE] Delete User Item',
        'Delete User Item Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async setItem(encodedEmail: string, encodedToken: string, uuid: string, password: string) {
    try {
      if (this.keyList.length >= 5000) {
        ClientLogger.debug('[AccountManager] keyList maximum reached. shift()');
        this.keyList.shift();
      }

      const isKeyExist = this.keyList.findIndex((item) => item === encodedEmail);

      if (isKeyExist > -1) return false;

      const setItem: ClientLoginItem = {
        token: encodedToken,
        uuid,
        password,
      };

      // this.userMap.set( key, { uuid, address, privateKey, pkToken } );
      this.keyList.push(encodedEmail);
      await this.redis.connect();
      await this.redis.set(encodedEmail, JSON.stringify(setItem));
      await this.redis.disconnect();

      return true;
    } catch (error) {
      ManagerLogger.error('[SET] User Info Error: %o', {
        error,
      });

      throw new RedisError(
        '[SET] User Info',
        'Set User Info',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async getItem(encodedEmail: string) {
    try {
      const key = this.keyList.find((item) => item === encodedEmail);

      ManagerLogger.debug('[GET] Client Map Inspection: %o', {
        encodedEmail,
        key,
        // map: this.userMap,
        userKey: this.keyList,
      });

      if (key === undefined) return null;

      ManagerLogger.info('[GET] Found key from keyList');

      await this.redis.connect();
      const gotItem = await this.redis.get(key);
      await this.redis.disconnect();

      if (gotItem === null) return null;

      const returnData = JSON.parse(gotItem) as ClientLoginItem;

      return returnData;
    } catch (error) {
      ManagerLogger.error('[GET] Get User Item Error: %o', {
        error,
      });

      throw new RedisError(
        '[GET] Get User Item',
        'Get User Item Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  //      public stop() {
  //     if (this.isListening) {
  //       this.isListening = false;

  //       // Account lock 이 전부 풀릴 때까지 대기
  //       for (;;) {
  //         // 등록된 주소와 mutex 조회
  //         const items = this.keyList
  //           .map((item) => ({ address: item.address, ...this.getItem(item.address) }))
  //           .filter((item) => item.mutex !== null);

  //         // 등록된 주소가 없을 경우 안전하게 끝낼 수 있음
  //         if (!items.length) break;

  //         // 그렇지 않을 경우 락 여부를 확인해야 함
  //         for (let i = 0; i < items.length; i += 1) {
  //           const item = items[i];

  //           if (item?.mutex?.isLocked()) {
  //             Logger.info('[AccountManager] Waiting for address in use(locked): %o', item.address);

  //             // 1초 대기
  //             // SIGTERM 핸들러는 비동기 코드 resolve 가 되지 않으므로 then() 으로 기다림
  //             setTimeout(1000).then(() =>
  //                  Logger.info ('[AccountManager] Waited 1 second for address: %o', item.address ));
  //           }
  //         }
  //       }

  //       TxLogger.info('[AccountManager] Address lock cleared, safe to shutdown.');
  //     }
  //   }
}
