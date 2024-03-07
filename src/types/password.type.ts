export interface SearchEmailRequest {
  name: string;
}

export interface SearchPasswordRequest {
  email: string;
  name: string;
}

export interface ValidatePasswordKeyRequest {
  tempKey: string;
}

export interface ValidateKeyItem {
  email: string;
  password: string;
  token: string;
}

export interface SearchChangePasswordRequest {
  email: string;
  name: string;
  password: string;
  newPassword: string;
}
