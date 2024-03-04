import { Body, Controller, Post, Query } from '@nestjs/common';
import { hackerNewsStarValidator, hackerNewsUnStarValidator, hackerNewsValidator } from '@validators/hacker.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { HackersNewsProvider } from 'providers/news/hacker/hacker.pvd';
import { DailyHackerNewsRequest } from 'types/hackers.type';
import { StarRequest } from 'types/request.type';

@Controller('hacker')
export class HackerController {
  constructor(private readonly hacker: HackersNewsProvider) {}

  @Post('news')
  async hackerGetLatestNewsController(
    @Body() request: DailyHackerNewsRequest,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {
      const { today } = await hackerNewsValidator(request);

      const { result, total } = await this.hacker.bringTodayHackerPosts(today, page, size);

      return new SetResponse(200, { result, total });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('star')
  async hackerGiveStarController(@Body() request: StarRequest) {
    try {
      const { uuid: PostUuid, email } = await hackerNewsStarValidator(request);

      await this.hacker.giveStar(PostUuid, email);

      return new SetResponse(200, { message: 'success' });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('unstar')
  async hackerUnStarController(@Body() request: StarRequest) {
    try {
      const { uuid: postUuid, email } = await hackerNewsUnStarValidator(request);

      await this.hacker.unStar(postUuid, email);

      return new SetResponse(200, { message: 'success' });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  // @Get('/starred')
  // async getStarredBbc(@Query('page') page: number, @Query('size') size: number) {
  //   try {
  //     const result = await this.hacker.bringStarredNews(page, size);

  //     return new SetResponse(200, { result });
  //   } catch (error) {
  //     return new SetErrorResponse(error);
  //   }
  // }
}
