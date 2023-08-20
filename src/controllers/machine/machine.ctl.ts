import { Body, Controller, Post } from "@nestjs/common";
import { SetErrorResponse, SetResponse } from "dto/response.dto";
import { MachineLearningProvider } from "libraries/providers/news/machine.lib";
import { ScrapeRequest, StarRequest } from "types/request.type";
import { machineLearningValidator } from "validators/ml.validator";
import { starValidator } from "validators/start.validator";

@Controller("ml")
export class MachineLearningController {
    constructor(private readonly mlNews: MachineLearningProvider){}

    @Post("/latest")
    async getLatestMlNewsController(@Body() request: ScrapeRequest) {
        try {
            const {today} = await machineLearningValidator(request);

            const result = await this.mlNews.bringLatestMachineLearningNews(today);

            return new SetResponse(200, {result});
        } catch (error) {
            return new SetErrorResponse(500, {error})
        }
    }

    @Post("/star")
    async giveStarNews(@Body() request: StarRequest) {
      try {
        const { uuid }  = await starValidator(request);
  
        const result = await this.mlNews.giveStar(uuid);
  
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
  
    @Post("/starred")
    async getStarredBbc() {
      try {
        const result = await this.hacker.bringStarredNews();
  
        return new SetResponse(200, {result});
      } catch (error) {
        return new SetErrorResponse(500, {error});
      }
    }

}