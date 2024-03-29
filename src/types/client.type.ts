export interface ClientSignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface ClientLoginRequest {
  email: string;
  password: string;
}

export interface ClientLogoutRequest {
  email: string;
}

export interface ClientLoginMapKey {
  email: string;
}

export interface ClientLoginMapItem {
  email: string;
  password: string;
}

export interface ClientLoginItem {
  token: string;
  uuid: string;
  password: string;
}

export interface ClientMyPageRequest {
  email: string;
}

export interface ClientMyPageStarNewsRequest {
  uuid: string;
  page: number;
}
