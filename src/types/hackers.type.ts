export interface HackersNewsArrayType {
  rank: string;
  post: string;
  link: string;
}

export interface DailyHackerNewsReturn {
  uuid: string;
  post: string;
  link: string;
  founded: Date;
  liked: number;
}

export interface DailyHackerNewsRequest {
  today: string;
}