import { BbcNewsReturnArray } from './bbc.type';
import { ClimateReturnData } from './climate.type';
import { HackersNewsArrayType } from './hackers.type';
import { NaverNewsItems } from './naver.type';

export interface ScrapeResultArray {
  bbc: BbcNewsReturnArray[];
  hackers: HackersNewsArrayType[];
  climate: ClimateReturnData[];
  naverNews: NaverNewsItems[];
}
