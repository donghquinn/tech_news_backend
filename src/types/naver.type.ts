export interface NaverSearchRequests {
  age: string;
  options: NaverDataLabRequestOptions;
}

export interface NaverDataLabRequestOptions {
  method: string;
  body: string;
}

export interface NaverDataLabResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  result: Array<NaverDataLabResults>;
}

export interface NaverDataLabResults {
  title: string;
  keywords: Array<string>;
  data: Array<NaverDataLabDataResult>;
}

export interface NaverDataLabDataResult {
  period: string;
  ratio: string;
}

export interface NaverNewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: Array<NaverNewsItems>;
}

export interface NaverNewsItems {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NaverNewsResultReturn {
  keyWord: string;
  title: string;
  url: string;
  postedTime: string;
}
