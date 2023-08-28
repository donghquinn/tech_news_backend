import { ForeCastProvider } from '@libraries/providers/climate/forecast.lib';
import { Body, Controller, Post } from '@nestjs/common';
import { forecastValidator } from '@validators/forecast.validators';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ForecastRequest } from 'types/forecast.type';

@Controller('forecast')
export class ForeCastController {
  constructor(private readonly shortForecast: ForeCastProvider) {}

  @Post('/short')
  async shortForecastController(@Body() request: ForecastRequest) {
    try {
      const { today } = await forecastValidator(request);

      const result = await this.shortForecast.getShortForecast(today);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(500, { error });
    }
  }
}
