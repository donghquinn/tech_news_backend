import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { hadaNewsStarValidator, hadaNewsValidator } from '@validators/hada.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { GeekProvider } from 'providers/news/geek/geek.pvd';
import { DailyHadaNewsRequest } from 'types/geek.type';
import { StarRequest } from 'types/request.type';

@Controller('geek')
export class GeekController {
  constructor(private readonly geek: GeekProvider) {}

  @Post('/news')
  async getHadaNews(@Body() request: DailyHadaNewsRequest) {
    try {
      const { today } = await hadaNewsValidator(request);

      const result = await this.geek.getNews(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/star')
  async giveStarNews(@Body() request: StarRequest, @Headers('Authorization') clientUuid: string) {
    try {
      const { uuid: postUuid } = await hadaNewsStarValidator(request);

      const result = await this.geek.giveStar(postUuid, clientUuid);

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
      const result = await this.geek.bringStarredNews(page, size);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
