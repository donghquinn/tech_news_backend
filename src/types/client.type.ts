export interface ClientSignupRequest {
  email: string;
  password: string;
}

export interface ClientLoginRequest {
  email: string;
  password: string;
}

export interface ClientLogoutRequest {
  uuid: string;
}

export interface ClientLoginMapKey {
  email: string;
}

export interface ClientLoginMapItem {
  uuid: string;
  password?: string;
}

export interface ClientMyPageRequest {
  uuid: string;
}
