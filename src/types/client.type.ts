export interface ClientSignupRequest {
  email: string;
  name: string;
  password: string;
}

export interface ClientLoginRequest {
  email: string;
  password: string;
}
