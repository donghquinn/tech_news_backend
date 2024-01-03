export interface DailyMlNewsReturn {
  uuid: string;
  category: string;
  title: string;
  link: string;
  founded: Date;
}

export interface DailyMlNewsRequest {
  today: string;
}
