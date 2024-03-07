import { Body, Controller, Post } from '@nestjs/common';
import { clientMyPageStarNewsValidator } from '@validators/client/mypage.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/client/client.pvd';
import { ClientMyPageStarNewsRequest } from 'types/client.type';

@Controller('users/star')
export class ClientStarController {
  constructor(private readonly client: ClientProvider) {}

  @Post('star/hacker')
  async getHackerStarNewsController(@Body() request: ClientMyPageStarNewsRequest) {
    try {
      const { uuid, page } = await clientMyPageStarNewsValidator(request);

      const { totalPosts, hackerNews: hackerStarredNews } = await this.client.myStarredHackerNews(uuid, page);

      return new SetResponse(200, {
        totalPosts,
        hackerStarredNews,
      });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('star/geek')
  async getGeekStarNewsController(@Body() request: ClientMyPageStarNewsRequest) {
    try {
      const { uuid, page } = await clientMyPageStarNewsValidator(request);

      const { totalPosts, resultNewsArray: geekStarredNews } = await this.client.myStarredGeekNews(uuid, page);

      return new SetResponse(200, {
        totalPosts,
        geekStarredNews,
      });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('star/ml')
  async getMlStarNewsController(@Body() request: ClientMyPageStarNewsRequest) {
    try {
      const { uuid, page } = await clientMyPageStarNewsValidator(request);

      const { totalPosts, mlNews: mlStarredNews } = await this.client.myStarredMlNews(uuid, page);

      return new SetResponse(200, {
        totalPosts,
        mlStarredNews,
      });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
