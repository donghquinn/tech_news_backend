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
  uuid: string;
}

export interface ClientLoginMapItem {
  email: string;
}

export interface ClientMyPageRequest {
  uuid: string;
}
