import { Body, Controller, Post } from "@nestjs/common";
import { SetErrorResponse, SetResponse } from "dto/response.dto";
import { MachineLearningProvider } from "libraries/providers/news/machine.lib";
import { ScrapeRequest } from "types/request.type";
import { machineLearningValidator } from "validators/ml.validator";

@Controller("ml")
export class MachineLearningController {
    constructor(private readonly mlNews: MachineLearningProvider){}

    @Post("/latest")
    async getLatestMlNewsController(@Body() request: ScrapeRequest) {
        try {
            const {today} = await machineLearningValidator(request);

            const result = this.mlNews.bringLatestMachineLearningNews(today);

            return new SetResponse(200, {result});
        } catch (error) {
            return new SetErrorResponse(500, {error})
        }
    }
}