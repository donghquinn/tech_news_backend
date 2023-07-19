import { Controller } from "@nestjs/common";
import { SetErrorResponse } from "dto/response.dto";
import { ForeCastProvider } from "libraries/providers/climate/forecast.lib";
import { ForecastRequest } from "types/forecast.type";

@Controller("forecast")
export class ForeCastController {
    constructor(private readonly getShortForecast: ForeCastProvider){}

    @Post("/short")
    async shortForecast(@Body() request: ForecastRequest) {
        try {

        } catch (error) {
            return new SetErrorResponse(500, {error});
        }
    }
}