import { Body, Controller, Post } from '@nestjs/common';
import { clientLoginValidator } from '@validators/client/login.validator';
import { clientLogoutValidator } from '@validators/client/logout.validator';
import { clientMyPageStarNewsValidator, clientMyPageValidator } from '@validators/client/mypage.validator';
import {
  searchEmailRequestValidator,
  searchPasswordRequestValidator,
  validatePasswordTempKeyRequestValidator,
} from '@validators/client/search.validator';
import { clientSignupValidator } from '@validators/client/signup.validator';
import { changePasswordValidator } from '@validators/client/user.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/client/client.pvd';
import {
  ClientLoginRequest,
  ClientLogoutRequest,
  ClientMyPageRequest,
  ClientMyPageStarNewsRequest,
  ClientSignupRequest,
} from 'types/client.type';
import { SearchEmailRequest, SearchPasswordRequest, ValidatePasswordKeyRequest } from 'types/password.type';
import { ChangePasswordRequest } from 'types/user.type';

// TODO User 회원가입 / 로그인 / 로그아웃 / 회원 탈퇴 기능 구현
@Controller('users')
export class ClientController {
  constructor(private readonly client: ClientProvider) {}

  @Post('signup')
  async signupController(@Body() request: ClientSignupRequest) {
    try {
      const { email, password, name } = await clientSignupValidator(request);

      if (email.length < 1 || password.length < 1)
        return new SetErrorResponse('Received User Info Should not be empty');

      const message = await this.client.checkEmailandSignup(email, password, name);

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

  @Post('mypage')
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

  @Post('search/email')
  async searchEmailController(@Body() request: SearchEmailRequest) {
    try {
      const { name } = await searchEmailRequestValidator(request);

      const email = await this.client.searchEmail(name);

      return new SetResponse(200, { email });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('search/password')
  async searchPasswordController(@Body() request: SearchPasswordRequest) {
    try {
      const { name, email } = await searchPasswordRequestValidator(request);

      const message = await this.client.searchPassword(email, name);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('search/password/validate')
  async validatePasswordTempKeyController(@Body() request: ValidatePasswordKeyRequest) {
    try {
      const { tempKey } = await validatePasswordTempKeyRequestValidator(request);

      const message = await this.client.validateSearchingPasswordKey(tempKey);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('change/password')
  async changePasswordController(@Body() request: ChangePasswordRequest) {
    try {
      const { password, email, newPassword } = await changePasswordValidator(request);

      const message = await this.client.changePassword(email, password, newPassword);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
