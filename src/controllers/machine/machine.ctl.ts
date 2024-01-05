import { MachineLearningProvider } from 'providers/news/machine.pvd';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { machineLearningValidator, mlNewsStarValidator } from '@validators/ml.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { StarRequest } from 'types/request.type';
import { DailyMlNewsRequest } from 'types/ml.type';

@Controller('ml')
export class MachineLearningController {
  constructor(private readonly mlNews: MachineLearningProvider) {}

  @Post('/latest')
  async getLatestMlNewsController(@Body() request: DailyMlNewsRequest) {
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
      const { uuid } = await mlNewsStarValidator(request);

      const result = await this.mlNews.giveStar(uuid);

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
