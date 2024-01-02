export interface HadaNewsReturn {
  uuid: string;
  post: string;
  descLink: string;
  founded: Date;
  originalLink?: string;
}

export interface DailyHadaNewsReturn {
  uuid: string;
  post: string;
  descLink: string;
  founded: Date;
  liked: number;
}
