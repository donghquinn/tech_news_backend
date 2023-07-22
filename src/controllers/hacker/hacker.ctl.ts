import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { HackersNewsProvider } from 'libraries/providers/news/hacker.lib';
import { MatchingDataRequest } from 'types/list.type';
import { dataRequestValidator } from 'validators/list.validator';

@Controller('hacker')
export class HackerController {
  constructor(private readonly hacker: HackersNewsProvider) { }

  @Get('/count')
  async getHackerCount() {
    try {
      const count = await this.hacker.getHackerNewsCount();

      return new SetResponse(200, { count });
    } catch (error) {
      return new SetErrorResponse(500, {error});
    }
  }

  @Post('/news')
  async getHackerNews(@Body() request: MatchingDataRequest) {
    try {
      const {today} = await dataRequestValidator(request);

      const result = await this.hacker.bringTodayHackerPosts(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, {error});
    }
  }
}
