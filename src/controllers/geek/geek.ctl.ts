import { Body, Controller, Post, Query } from '@nestjs/common';
import { geekNewsStarValidator, geekNewsUnStarValidator, geekNewsValidator } from '@validators/geek.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { GeekProvider } from 'providers/news/geek/geek.pvd';
import { DailyHadaNewsRequest } from 'types/geek.type';
import { StarRequest } from 'types/request.type';

@Controller('geek')
export class GeekController {
  constructor(private readonly geek: GeekProvider) {}

  @Post('news')
  async geekGetLatestNewsController(
    @Body() request: DailyHadaNewsRequest,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {
      const { today } = await geekNewsValidator(request);

      const { result, total } = await this.geek.getNews(today, page, size);

      return new SetResponse(200, { result, total });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('star')
  async geekGiveStarController(@Body() request: StarRequest) {
    try {
      const { uuid: postUuid, email } = await geekNewsStarValidator(request);

      await this.geek.giveStar(postUuid, email);

      return new SetResponse(200, { message: 'success' });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('unstar')
  async geekUnStarController(@Body() request: StarRequest) {
    try {
      const { uuid: postUuid, email } = await geekNewsUnStarValidator(request);

      await this.geek.unStar(postUuid, email);

      return new SetResponse(200, { message: 'success' });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  // @Get('/starred')
  // async getStarredBbc(@Query('page') page: number, @Query('size') size: number) {
  //   try {
  //     const result = await this.geek.bringStarredNews(page, size);

  //     return new SetResponse(200, { result });
  //   } catch (error) {
  //     return new SetErrorResponse(error);
  //   }
  // }
}
