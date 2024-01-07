import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { hadaNewsStarValidator, hadaNewsValidator } from '@validators/hada.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { HadaProvider } from 'providers/news/hada.pvd';
import { DailyHadaNewsRequest } from 'types/hada.type';
import { StarRequest } from 'types/request.type';

@Controller('hada')
export class HadaController {
  constructor(private readonly hada: HadaProvider) {}

  @Post('/news')
  async getHadaNews(@Body() request: DailyHadaNewsRequest) {
    try {
      const { today } = await hadaNewsValidator(request);

      const result = await this.hada.getNews(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/star')
  async giveStarNews(@Body() request: StarRequest) {
    try {
      const { uuid } = await hadaNewsStarValidator(request);

      const result = await this.hada.giveStar(uuid);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
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
  async getStarredBbc(@Query('page') page: number, @Query('size') size: number) {
    try {
      const result = await this.hada.bringStarredNews(page, size);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
