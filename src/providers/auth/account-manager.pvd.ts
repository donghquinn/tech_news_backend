import { RedisError } from '@errors/redis.error';
import { cryptData } from '@libraries/client/encrypt.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger, ManagerLogger } from '@utils/logger.util';
import { RedisClientType, createClient } from 'redis';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';
import { ClientLoginItem } from 'types/client.type';

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

  /**
   *
   * @param clientUuid
   * @param email
   * @param password
   * @returns
   */
  public async setLoginUser(email: string, uuid: string, password: string) {
    const { encodedData: encodedEmail, encodedToken: encodedEmailToken } = cryptData(email);

    const isLogined = await this.getItem(encodedEmail);

    ManagerLogger.debug('[ACCOUNT] Searching User Info: %o', {
      isLogined,
      encodedEmail,
    });

    if (isLogined === null) {
      this.keyList.push(encodedEmail);
      await this.setItem(encodedEmail, encodedEmailToken, uuid, password);

      if (this.keyList.length >= 5000) {
        ClientLogger.debug('[AccountManager] keyList maximum reached. shift()');
        this.keyList.shift();
      }

      ClientLogger.info('[ACCOUNT] Set Finished');

      return encodedEmail;
    }

    ManagerLogger.debug('[ACCOUNT] Found User Key: %o', {
      uuid,
    });

    const interval = 1000 * 60 * 10;

    const timer = setIntervalAsync(async () => {
      const isExsit = await this.getItem(encodedEmail);

      if (isExsit === null) {
        ManagerLogger.info('[ACCOUNT] It is not existing user. Clear Interval.');

        ManagerLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
          isExsit,
          uuid,
        });

        clearIntervalAsync(timer);
      } else {
        ManagerLogger.info('[ACCOUNT] Expiration time. Delete user.');

        ManagerLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
          uuid,
        });

        await this.deleteItem(encodedEmail);
      }
    }, interval);

    return encodedEmail;
  }

  public async deleteLogoutUser(encodedEmail: string) {
    ManagerLogger.debug('[ACCOUNT] Client Data: %o', {
      encodedEmail,
    });

    const isExist = await this.getItem(encodedEmail);

    if (isExist === null) {
      ManagerLogger.info('[ACCOUNT] Not Matchin Data found. Ignore.');

      return false;
    }

    await this.deleteItem(encodedEmail);

    ManagerLogger.debug('[ACCOUNT] Client Map Delete Inspection: %o', {
      encodedEmail,
    });

    return true;
  }

  public async deleteItem(encodedEmail: string) {
    try {
      const index = this.keyList.findIndex((item) => item === encodedEmail);

      if (index > -1) {
        this.keyList.splice(index, 1);
        await this.redis.del(encodedEmail);

        ManagerLogger.info('[DELETE] Deleted User Info from Key List and Cache Data');
      }

      ManagerLogger.debug('[DELETE] Client Map Inspection: %o', {
        encodedEmail,
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

  public async setItem(encodedEmail: string, encodedToken: string, uuid: string, password: string) {
    try {
      const setItem: ClientLoginItem = {
        token: encodedToken,
        uuid,
        password,
      };

      // this.userMap.set( key, { uuid, address, privateKey, pkToken } );
      this.keyList.push(encodedEmail);
      await this.redis.set(encodedEmail, JSON.stringify(setItem));
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

      const gotItem = await this.redis.get(key);

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
