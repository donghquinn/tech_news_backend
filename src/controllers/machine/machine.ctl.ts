import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { machineLearningValidator, mlNewsStarValidator } from '@validators/ml.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { MachineLearningProvider } from 'providers/news/ml/machine.pvd';
import { DailyMlNewsRequest } from 'types/ml.type';
import { StarRequest } from 'types/request.type';

@Controller('ml')
export class MachineLearningController {
  constructor(private readonly mlNews: MachineLearningProvider) {}

  @Post('/latest')
  async getLatestMlNewsController(
    @Body() request: DailyMlNewsRequest,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {
      const { today } = await machineLearningValidator(request);

      const result = await this.mlNews.bringLatestMachineLearningNews(today, page, size);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/star')
  async giveStarNews(@Body() request: StarRequest, @Headers('Authorization') clientUuid: string) {
    try {
      const { uuid: postUuid } = await mlNewsStarValidator(request);

      const result = await this.mlNews.giveStar(postUuid, clientUuid);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Get('/starred')
  async getStarredBbc(@Query('page') page: number, @Query('size') size: number) {
    try {
      const result = await this.mlNews.bringStarredNews(page, size);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
