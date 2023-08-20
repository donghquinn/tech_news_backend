import { Body, Controller, Get, Post } from '@nestjs/common';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { HackersNewsProvider } from 'libraries/providers/news/hacker.lib';
import { MatchingDataRequest } from 'types/list.type';
import { StarRequest } from 'types/request.type';
import { dataRequestValidator } from 'validators/list.validator';
import { starValidator } from 'validators/start.validator';

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

  @Post("/star")
  async giveStarNews(@Body() request: StarRequest) {
    try {
      const { uuid }  = await starValidator(request);

      const result = await this.hacker.giveStar(uuid);

      return new SetResponse(200, {result});
    } catch (error) {
      return new SetErrorResponse(500, {error});
    }
  }

  @Post("/unstar")
  async unStarNews(@Body() request: StarRequest) {
    try {
      const {uuid} = await starValidator(request);

      const result = await this.hacker.unStar(uuid);

      return new SetResponse(200, {result});
    } catch (error) {
      return new SetErrorResponse(500, {error});
    }
  }

  @Get("/starred")
  async getStarredBbc() {
    try {
      const result = await this.hacker.bringStarredNews();

      return new SetResponse(200, {result});
    } catch (error) {
      return new SetErrorResponse(500, {error});
    }
  }
}
