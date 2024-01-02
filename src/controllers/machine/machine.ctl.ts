import { MachineLearningProvider } from 'providers/news/machine.pvd';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { machineLearningValidator, mlNewsStarValidator } from '@validators/ml.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ScrapeRequest, StarRequest } from 'types/request.type';

@Controller('ml')
export class MachineLearningController {
  constructor(private readonly mlNews: MachineLearningProvider) {}

  @Post('/latest')
  async getLatestMlNewsController(@Body() request: ScrapeRequest) {
    try {
      const { today } = await machineLearningValidator(request);

      const result = await this.mlNews.bringLatestMachineLearningNews(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/star')
  async giveStarNews(@Body() request: StarRequest) {
    try {
      const { uuid, isStarred } = await mlNewsStarValidator(request);

      const result = await this.mlNews.giveStar(uuid, isStarred);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Get('/starred')
  async getStarredBbc() {
    try {
      const result = await this.mlNews.bringStarredNews();

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
