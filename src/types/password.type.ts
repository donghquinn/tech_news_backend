export interface SearchEmailRequest {
  name: string;
}

export interface SearchPasswordRequest {
  email: string;
  name: string;
}

/**
 * tempKey: 메일로 보낸 임의의 난수 키 검증
 */
export interface ValidatePasswordKeyRequest {
  tempKey: string;
}

export interface ValidateKeyItem {
  email: string;
  password: string;
  token: string;
}

/**
 * email: 유저 이메일
 * name: 유저 이름
 * password: 인코딩 된 이전 패스워드
 * newPassword: 인코딩 된 변경할 패스워드
 */
export interface SearchChangePasswordRequest {
  email: string;
  name: string;
  password: string;
  newPassword: string;
}
