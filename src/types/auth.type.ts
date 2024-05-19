export interface JwtPayload {
  userId: string;
  sessionId: string;
  userType: string;
}

export interface JwtToken {
  userId: string;
  sessionId: string;
  userType: string;
  iat: number;
  exp: number;
}
