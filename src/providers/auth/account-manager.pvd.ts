import { Injectable } from '@nestjs/common';
import { ClientLogger, ManagerLogger } from '@utils/logger.util';
import { ClientLoginMapItem, ClientLoginMapKey } from 'types/client.type';

@Injectable()
export class AccountManager {
  private userMap: WeakMap<ClientLoginMapKey, ClientLoginMapItem>;

  private userKeys: Array<ClientLoginMapKey>;

  constructor() {
    this.userKeys = [];
    this.userMap = new WeakMap();
  }

  public setLoginUser(clientUuid: string, email: string, password?: string) {
    const isLogined = this.getItem(clientUuid);

    ManagerLogger.debug('[ACCOUNT] Searching User Info: %o', {
      isLogined,
      map: this.userMap,
      clientUuid,
    });

    if (!isLogined) {
      const clientKey = { uuid: clientUuid };
      this.userKeys.push(clientKey);
      this.setItem(email, clientKey, password);

      if (this.userKeys.length >= 5000) {
        ClientLogger.debug('[AccountManager] keyList maximum reached. shift()');
        this.userKeys.shift();
      }

      return clientKey;
    }

    ManagerLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
      map: this.userMap,
    });

    const interval = 1000 * 60 * 10;

    const timer = setInterval(() => {
      const isExsit = this.getItem(clientUuid);

      if (!isExsit) {
        ManagerLogger.info('[ACCOUNT] It is not existing user. Clear Interval.');

        ManagerLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
          isExsit,
          clientUuid,
          map: this.userMap,
        });

        clearInterval(timer);
      } else {
        ManagerLogger.info('[ACCOUNT] Expiration time. Delete user.');

        ManagerLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
          clientUuid,
          map: this.userMap,
        });
        this.deleteItem(clientUuid);
      }
    }, interval);

    return isLogined;
  }

  public deleteLogoutUser(clientUuid: string) {
    ManagerLogger.debug('[ACCOUNT] Client Data: %o', {
      clientUuid,
      map: this.userMap,
    });

    const isExist = this.getItem(clientUuid);

    if (!isExist) {
      ManagerLogger.info('[ACCOUNT] Not Matchin Data found. Ignore.');

      return false;
    }

    this.deleteItem(clientUuid);

    ManagerLogger.debug('[ACCOUNT] Client Map Delete Inspection: %o', {
      clientUuid,
      map: this.userMap,
    });

    return true;
  }

  public deleteItem(clientUuid: string) {
    const index = this.userKeys.findIndex((item) => item.uuid === clientUuid);

    if (index > -1) this.userKeys.splice(index, 1);
  }

  public setItem(email: string, clientKey: ClientLoginMapKey, password?: string) {
    return this.userMap.set(clientKey, { email, password });
  }

  public getItem(clientUuid: string) {
    const key = this.userKeys.find((item) => item.uuid === clientUuid);

    if (!key) return null;

    return this.userMap.get(key);
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
