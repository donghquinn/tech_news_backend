import { Body, Controller, Post, Query } from '@nestjs/common';
import { machineLearningValidator, mlNewsStarValidator, mlNewsUnStarValidator } from '@validators/ml.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { MachineLearningProvider } from 'providers/news/ml/machine.pvd';
import { DailyMlNewsRequest } from 'types/ml.type';
import { StarRequest } from 'types/request.type';

@Controller('ml')
export class MachineLearningController {
  constructor(private readonly mlNews: MachineLearningProvider) {}

  @Post('/news')
  async mlGetLatestNewsController(
    @Body() request: DailyMlNewsRequest,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {
      const { today } = await machineLearningValidator(request);

      const { result, total } = await this.mlNews.bringLatestMachineLearningNews(today, page, size);

      return new SetResponse(200, { result, total });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/star')
  async mlGiveStarController(@Body() request: StarRequest) {
    try {
      const { uuid: postUuid, email } = await mlNewsStarValidator(request);

      await this.mlNews.giveStar(postUuid, email);

      return new SetResponse(200, { message: 'success' });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/unstar')
  async mlUnStarController(@Body() request: StarRequest) {
    try {
      const { uuid: postUuid, email } = await mlNewsUnStarValidator(request);

      await this.mlNews.unStar(postUuid, email);

      return new SetResponse(200, { message: 'success' });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
