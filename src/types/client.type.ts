export interface ClientSignupRequest {
  email: string;
  password: string;
}

export interface ClientLoginRequest {
  email: string;
  password: string;
}

export interface ClientLoginMapKey
{
  uuid: string;
}

export interface ClientLoginMapItem
{
  email: string;
}