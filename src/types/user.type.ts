export interface ChangePasswordRequest {
  email: string;
  password: string;
  newPassword: string;
}

export interface ChangeTitleRequest {
  email: string;
  title: string;
}
