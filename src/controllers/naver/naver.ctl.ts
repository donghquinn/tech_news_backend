import { NaverProvider } from '@libraries/providers/news/naver.lib';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { dataRequestValidator } from '@validators/list.validator';
import { starValidator } from '@validators/start.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { MatchingDataRequest } from 'types/list.type';
import { StarRequest } from 'types/request.type';


@Controller('naver')
export class NaverController {
  constructor(private readonly naver: NaverProvider) { }

  @Post('/today')
  async getTodayNewsController(@Body() request: MatchingDataRequest) {
    try {
      const {today} = await dataRequestValidator(request);

      Logger.log(today);

      const result = await this.naver.getNaverNews(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, {error});
    }
  }

  @Post("/star")
  async giveStarNews(@Body() request: StarRequest) {
    try {
      const { uuid }  = await starValidator(request);

      const result = await this.naver.giveStar(uuid);

      return new SetResponse(200, {result});
    } catch (error) {
      return new SetErrorResponse(500, {error});
    }
  }

  @Post("/unstar")
  async unStarNews(@Body() request: StarRequest) {
    try {
      const {uuid} = await starValidator(request);

      const result = await this.naver.unStar(uuid);

      return new SetResponse(200, {result});
    } catch (error) {
      return new SetErrorResponse(500, {error});
    }
  }

  @Get("/starred")
  async getStarredBbc() {
    try {
      const result = await this.naver.bringStarredNews();

      return new SetResponse(200, {result});
    } catch (error) {
      return new SetErrorResponse(500, {error});
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
