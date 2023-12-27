import { NaverProvider } from '@libraries/providers/news/naver.pvd';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import {
  naverNewsStarValidator,
  naverNewsUnStarValidator,
  naverNewsValidator,
} from '@validators/naver.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { MatchingDataRequest } from 'types/list.type';
import { StarRequest } from 'types/request.type';

@Controller('naver')
export class NaverController {
  constructor(private readonly naver: NaverProvider) {}

  @Post('/today')
  async getTodayNewsController(@Body() request: MatchingDataRequest) {
    try {
      const { today } = await naverNewsValidator(request);

      Logger.log(today);

      const result = await this.naver.getNaverNews(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/star')
  async giveStarNews(@Body() request: StarRequest) {
    try {
      const { uuid } = await naverNewsStarValidator(request);

      const result = await this.naver.giveStar(uuid);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/unstar')
  async unStarNews(@Body() request: StarRequest) {
    try {
      const { uuid } = await naverNewsUnStarValidator(request);

      const result = await this.naver.unStar(uuid);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Get('/starred')
  async getStarredBbc() {
    try {
      const result = await this.naver.bringStarredNews();

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
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
