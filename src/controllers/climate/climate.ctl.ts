import { ClimateProvider } from '@libraries/providers/climate/climate.pvd';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { dataRequestValidator } from '@validators/list.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { MatchingDataRequest } from 'types/list.type';

@Controller('climate')
export class ClimateController {
  constructor(private readonly climate: ClimateProvider) {}

  @Post('/today')
  async getClimate(@Body() request: MatchingDataRequest) {
    try {
      const { today } = await dataRequestValidator(request);

      Logger.log(today);

      const result = await this.climate.getDailyClimateData(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, { error });
    }
  }
}
