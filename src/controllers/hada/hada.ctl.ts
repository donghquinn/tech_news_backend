import { HadaProvider } from '@libraries/providers/news/hada.pvd';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { dataRequestValidator } from '@validators/list.validator';
import { starValidator } from '@validators/start.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { MatchingDataRequest } from 'types/list.type';
import { StarRequest } from 'types/request.type';

@Controller('hada')
export class HadaController {
  constructor(private readonly hada: HadaProvider) {}

  @Post('/news')
  async getHackerNews(@Body() request: MatchingDataRequest) {
    try {
      const { today } = await dataRequestValidator(request);

      const result = await this.hada.getNews(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, { error });
    }
  }

  @Post('/star')
  async giveStarNews(@Body() request: StarRequest) {
    try {
      const { uuid, isStarred } = await starValidator(request);

      const result = await this.hada.giveStar(uuid, isStarred);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, { error });
    }
  }

  // @Post('/unstar')
  // async unStarNews(@Body() request: StarRequest) {
  //   try {
  //     const { uuid } = await starValidator(request);

  //     const result = await this.hacker.unStar(uuid);

  //     return new SetResponse(200, { result });
  //   } catch (error) {
  //     return new SetErrorResponse(500, { error });
  //   }
  // }

  @Get('/starred')
  async getStarredBbc() {
    try {
      const result = await this.hada.bringStarredNews();

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, { error });
    }
  }
}
