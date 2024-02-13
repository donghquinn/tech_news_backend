import { RedisError } from '@errors/redis.error';
import { Injectable } from '@nestjs/common';
import { ClientLogger, ManagerLogger } from '@utils/logger.util';
import { RedisClientType, createClient } from 'redis';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';
import { ClientLoginMapItem } from 'types/client.type';

@Injectable()
export class AccountManager {
  private redis: RedisClientType;

  private keyList: Array<string>;

  private redisUrl: string;

  constructor() {
    // eslint-disable-next-line max-len
    this.redisUrl = `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

    this.redis = createClient({
      url: this.redisUrl,
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASS,
    });

    this.keyList = [];
  }

  public async setLoginUser(clientUuid: string, email: string, password: string) {
    const isLogined = this.getItem(email);

    ManagerLogger.debug('[ACCOUNT] Searching User Info: %o', {
      isLogined,
      clientUuid,
    });

    if (isLogined === null) {
      this.keyList.push(email);
      await this.setItem(email, clientUuid, password);

      if (this.keyList.length >= 5000) {
        ClientLogger.debug('[AccountManager] keyList maximum reached. shift()');
        this.keyList.shift();
      }

      ClientLogger.info('[ACCOUNT] Set Finished');

      return clientUuid;
    }

    ManagerLogger.debug('[ACCOUNT] Found User Key: %o', {
      clientUuid,
    });

    const interval = 1000 * 60 * 10;

    const timer = setIntervalAsync(async () => {
      const isExsit = await this.getItem(email);

      if (isExsit === null) {
        ManagerLogger.info('[ACCOUNT] It is not existing user. Clear Interval.');

        ManagerLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
          isExsit,
          clientUuid,
        });

        clearIntervalAsync(timer);
      } else {
        ManagerLogger.info('[ACCOUNT] Expiration time. Delete user.');

        ManagerLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
          clientUuid,
        });

        await this.deleteItem(email);
      }
    }, interval);

    return clientUuid;
  }

  public async deleteLogoutUser(email: string) {
    ManagerLogger.debug('[ACCOUNT] Client Data: %o', {
      email,
    });

    const isExist = await this.getItem(email);

    if (isExist === null) {
      ManagerLogger.info('[ACCOUNT] Not Matchin Data found. Ignore.');

      return false;
    }

    await this.deleteItem(email);

    ManagerLogger.debug('[ACCOUNT] Client Map Delete Inspection: %o', {
      email,
    });

    return true;
  }

  public async deleteItem(email: string) {
    try {
      const index = this.keyList.findIndex((item) => item === email);

      if (index > -1) {
        this.keyList.splice(index, 1);
        await this.redis.del(email);

        ManagerLogger.info('[DELETE] Deleted User Info from Key List and Cache Data');
      }

      ManagerLogger.debug('[DELETE] Client Map Inspection: %o', {
        email,
        index,
        // map: this.userMap,
        userKey: this.keyList,
      });
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

  public async setItem(email: string, uuid: string, password: string) {
    try {
      // this.userMap.set( key, { uuid, address, privateKey, pkToken } );
      await this.redis.set(email, JSON.stringify({ uuid, password }));
      this.keyList.push(email);
    } catch (error) {
      throw new RedisError(
        '[SET] User Info',
        'Set User Info',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async getItem(email: string) {
    try {
      const key = this.keyList.find((item) => item === email);

      ManagerLogger.debug('[GET] Client Map Inspection: %o', {
        email,
        key,
        // map: this.userMap,
        userKey: this.keyList,
      });

      if (key === undefined) return null;

      ManagerLogger.info('[GET] Found key from keyList');

      const gotItem = await this.redis.get(key);

      if (gotItem === null) return null;

      const returnData = JSON.parse(gotItem) as ClientLoginMapItem;

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
