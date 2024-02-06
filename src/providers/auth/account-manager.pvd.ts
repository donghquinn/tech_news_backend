import { Injectable } from '@nestjs/common';
import { ManagerLogger } from '@utils/logger.util';
import { ClientLoginMapItem, ClientLoginMapKey } from 'types/client.type';

@Injectable()
export class AccountManager {
  private userMap: WeakMap<ClientLoginMapKey, ClientLoginMapItem>;

  constructor() {
    this.userMap = new WeakMap();
  }

  public setLoginUser(clientKey: ClientLoginMapKey, email: string, password?: string) {
    const isLogined = this.searchItem(clientKey);

    if (isLogined) {
      ManagerLogger.info('[ACCOUNT] Found Already Logined User Info. Ignore');

      return;
    }

    this.setItem(email, clientKey, password);

    ManagerLogger.debug('[ACCOUNT] Client Map Inspection: %o', {
      map: this.userMap,
    });

    const interval = 1000 * 60 * 10;

    const timer = setInterval(() => {
      const isExsit = this.searchItem(clientKey);

      if (!isExsit) {
        ManagerLogger.info('[ACCOUNT] It is not existing user. Clear Interval.');

        clearInterval(timer);
      } else {
        ManagerLogger.info('[ACCOUNT] Expiration time. Delete user.');
        this.deleteItem(clientKey);
      }
    }, interval);
  }

  public deleteLogoutUser(clientKey: ClientLoginMapKey) {
    const isExist = this.searchItem(clientKey);

    if (!isExist) {
      ManagerLogger.info('[ACCOUNT] Not Matchin Data found. Ignore.');

      return;
    }

    this.deleteItem(clientKey);
    ManagerLogger.debug('[ACCOUNT] Client Map Delete Inspection: %o', {
      clientKey,
      map: this.userMap,
    });
  }

  public searchItem(clientKey: ClientLoginMapKey) {
    return this.userMap.has(clientKey);
  }

  public deleteItem(clientKey: ClientLoginMapKey) {
    return this.userMap.delete(clientKey);
  }

  public setItem(email: string, clientKey: ClientLoginMapKey, password?: string) {
    return this.userMap.set(clientKey, { email, password });
  }

  public getItem(clientKey: ClientLoginMapKey) {
    return this.userMap.get(clientKey);
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
