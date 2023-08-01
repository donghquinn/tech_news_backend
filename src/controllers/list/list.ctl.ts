import { Controller, Get, Logger, Post } from "@nestjs/common";
import { SetErrorResponse, SetResponse } from "dto/response.dto";
import { GetList } from "libraries/providers/list.lib";
import { ListRequest } from "types/list.type";
import { listRequestValidator } from "validators/list.validator";

@Controller("list")
export class ScrapedList {
    constructor(private readonly list: GetList) { }
    
    // 사용할 수  있는 일자 리스트 조회
    @Get("/get")
    async getListController() {
        try {
            const dateList = await this.list.getDateList();

            return new SetResponse(200, { dateList });
        } catch (error) {
            return new SetErrorResponse(500, { error });
        }
    }

    // 조회하기 원하는 일자의 데이터 조회 요청
    @Post("/data")
    async getMatchingData(request: ListRequest) {
        try {
            const { date } = await listRequestValidator(request);
            
            Logger.log(date);

            const result = await this.list.getMatchingData(date);

            return new SetResponse(200, { result });
        } catch (error) {
            return new SetErrorResponse(500, { error });
        }
    }
}