import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { BbcNewsProvider } from 'providers/news/bbc.pvd';
import { MatchingDataRequest } from 'types/list.type';
import { StarRequest } from 'types/request.type';
import { dataRequestValidator } from 'validators/list.validator';
import { starValidator } from 'validators/start.validator';

@Controller('bbc')
export class BbcController {
  constructor(private readonly bbc: BbcNewsProvider) {}

  @Get('/count')
  async getBbcCount() {
    try {
      const count = await this.bbc.getBbcCount();

      return new SetResponse(200, { count });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/news')
  async getBbcNews(@Body() request: MatchingDataRequest) {
    try {
      const { today } = await dataRequestValidator(request);

      Logger.log(today);

      const result = await this.bbc.bringTodayBbcNews(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/date/list')
  async getDateList() {
    try {
      const result = await this.bbc.getDateList();

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/star')
  async giveStarNews(@Body() request: StarRequest) {
    try {
      const { uuid } = await starValidator(request);

      const result = await this.bbc.giveStar(uuid);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/unstar')
  async unStarNews(@Body() request: StarRequest) {
    try {
      const { uuid } = await starValidator(request);

      const result = await this.bbc.unStar(uuid);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Get('/starred')
  async getStarredBbc() {
    try {
      const result = await this.bbc.bringStarredNews();

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
