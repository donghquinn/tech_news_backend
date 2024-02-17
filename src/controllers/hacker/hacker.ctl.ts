import { Body, Controller, Get, Post, Headers, Query, Param } from '@nestjs/common';
import { hackerNewsStarValidator, hackerNewsValidator } from '@validators/hacker.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { HackersNewsProvider } from 'providers/news/hacker/hacker.pvd';
import { DailyHackerNewsRequest } from 'types/hackers.type';
import { StarRequest } from 'types/request.type';

@Controller('hacker')
export class HackerController {
  constructor(private readonly hacker: HackersNewsProvider) {}

  @Get('/count')
  async getHackerCount() {
    try {
      const count = await this.hacker.getHackerNewsCount();

      return new SetResponse(200, { count });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/news')
  async getHackerNews(@Body() request: DailyHackerNewsRequest, @Param() page: number, @Param() size: number) {
    try {
      const { today } = await hackerNewsValidator(request);

      const result = await this.hacker.bringTodayHackerPosts(today, page, size);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/star')
  async giveStarNews(@Body() request: StarRequest, @Headers('Authorization') clientUuid: string) {
    try {
      const { uuid: PostUuid } = await hackerNewsStarValidator(request);

      const result = await this.hacker.giveStar(PostUuid, clientUuid);

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
      const result = await this.hacker.bringStarredNews(page, size);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
