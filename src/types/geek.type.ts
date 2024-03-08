export interface GeekNewsReturn {
  uuid: string;
  post: string;
  descLink: string;
  founded: Date;
  likedCount: number;
  originalLink?: string;
}

export interface DailyGeekNewsReturn {
  uuid: string;
  post: string;
  descLink: string;
  founded: Date;
  liked: number;
}

export interface DailyGeekNewsRequest {
  today: string;
}
