import { RedisError } from '@errors/redis.error';
import { Injectable } from '@nestjs/common';
import { ClientLogger, ManagerLogger } from '@utils/logger.util';
import { RedisClientType, createClient } from 'redis';
import { ClientLoginItem } from 'types/client.type';
import { ValidateKeyItem } from 'types/password.type';

@Injectable()
export class AccountManager {
  private redis: RedisClientType;

  private keyList: Array<string>;

  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_HOST,
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASS,
    });

    this.keyList = [];
  }

  /**
   * REDIS 연결 체크
   */
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
 * REDIS 에 등록된 회원 정보(로그인 상태 정보) 삭제
 * @param encodedEmail 암호화된 유저 이메일(REDIS 키)
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

  /**
   * Redis에 로그인 유저 정보 저장
   * @param encodedEmail 암호화 된 유저 이메일 (REDIS 키)
   * @param encodedToken 이메일 복호화 토큰
   * @param uuid 유저 UUID
   * @param password 암호화된 유저 패스워드
   * @returns booelan 값
   */
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
      await this.redis.set(encodedEmail, JSON.stringify(setItem), {
        EX: 60 * 60,
      });
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

  /**
   * REDIS에서 유저 로그인 정보 가져오는 함수
   * @param encodedEmail 암호화 된 유저 이메일 (REDIS 키)
   * @returns 유저 정보 | NULL
   */
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

  /**
   * 패스워드 찾기 위한 키 검증 용
   * 메일로 전송된 인증 키 검증 위해 임시적으로 REDIS에 세팅 - 제한시간 3분
   * @param tempKey 생성된 임의 난수 키
   * @param email 해당되는 이메일
   * @param password 해당되는 암호화 된 패스워드
   * @param token 해당되는 패스워드 복호화 토큰
   * @returns
   */
  async setTempData(tempKey: string, email: string, password: string, token: string) {
    try {
      await this.redis.connect();

      const validateItem: ValidateKeyItem = {
        email,
        password,
        token,
      };

      await this.redis.set(tempKey, JSON.stringify(validateItem), {
        EX: 60 * 3,
      });

      await this.redis.disconnect();

      return true;
    } catch (error) {
      ManagerLogger.error('[VALIDATE_KEY] Set Temp Key Error: %o', {
        error,
      });

      throw new RedisError(
        '[VALIDATE_KEY] Set Temp Key',
        'Set Temp Key Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  /**
   * 패스워드 찾기 위한 키 검증용
   * 메일로 전송된 검증 키를 받아 찾기
   * @param tempKey 전송된 임의 난수 검증 키
   * @returns
   */
  async getTempData(tempKey: string) {
    try {
      await this.redis.connect();

      const result = await this.redis.get(tempKey);

      if (result === null) return null;

      const returnData = JSON.parse(result) as ValidateKeyItem;

      await this.redis.del(tempKey);

      await this.redis.disconnect();

      return returnData;
    } catch (error) {
      ManagerLogger.error('[VALIDATE_KEY] Get Temp Key Error: %o', {
        error,
      });

      throw new RedisError(
        '[ VALIDATE_KEY ] Get Temp Key',
        'Get Temp Key Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
