import { Body, Controller, Get } from '@nestjs/common';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { NaverProvider } from 'libraries/providers/naver.lib';
import { MatchingDataRequest } from 'types/list.type';
import { listValidator } from 'validators/list.validator';

@Controller('naver')
export class NaverController {
  constructor(private readonly naver: NaverProvider) { }

  @Get('/today')
  async getTodayNewsController(@Body() request: MatchingDataRequest) {
    try {
      const {today} = await listValidator(request);

      const result = await this.naver.getNaverNews(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, error);
    }
  }

  // @Get("/kin/count")
  // async getKinNewsController() {
  //   try { 

  //   } catch (error) {
  //     return new SetErrorResponse(500, error);
  //   }
  // }
}
