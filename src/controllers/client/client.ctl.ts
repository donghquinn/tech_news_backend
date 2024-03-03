import { Body, Controller, Post } from '@nestjs/common';
import { clientLoginValidator } from '@validators/client/login.validator';
import { clientLogoutValidator } from '@validators/client/logout.validator';
import { clientMyPageStarNewsValidator, clientMyPageValidator } from '@validators/client/mypage.validator';
import { clientSignupValidator } from '@validators/client/signup.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/client/client.pvd';
import {
  ClientLoginRequest,
  ClientLogoutRequest,
  ClientMyPageRequest,
  ClientMyPageStarNewsRequest,
  ClientSignupRequest,
} from 'types/client.type';

// TODO User 회원가입 / 로그인 / 로그아웃 / 회원 탈퇴 기능 구현
@Controller('users')
export class ClientController {
  constructor(private readonly client: ClientProvider) {}

  @Post('signup')
  async signupController(@Body() request: ClientSignupRequest) {
    try {
      const { email, password } = await clientSignupValidator(request);

      if (email.length < 1 || password.length < 1)
        return new SetErrorResponse('Received User Info Should not be empty');

      const message = await this.client.checkEmailandSignup(email, password);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('login')
  async loginController(@Body() request: ClientLoginRequest) {
    try {
      const { email, password } = await clientLoginValidator(request);

      if (email.length < 1 || password.length < 1)
        return new SetErrorResponse('Received User Info Should not be empty');

      const encodedEmail = await this.client.login(email, password);

      return new SetResponse(200, { email: encodedEmail });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('logout')
  async logoutController(@Body() request: ClientLogoutRequest) {
    try {
      const { email: encodedEmail } = await clientLogoutValidator(request);

      const message = await this.client.logout(encodedEmail);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('myPage')
  async myPageController(@Body() request: ClientMyPageRequest) {
    try {
      const { email: encodedEmail } = await clientMyPageValidator(request);

      const results = await this.client.myPage(encodedEmail);

      return new SetResponse(200, {
        results,
      });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

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
