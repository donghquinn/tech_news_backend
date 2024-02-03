import { Body, Controller, Post } from '@nestjs/common';
import { clientLoginValidator } from '@validators/client/login.validator';
import { clientLogoutValidator } from '@validators/client/logout.validator';
import { clientSignupValidator } from '@validators/client/signup.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/client/client.pvd';
import { ClientLoginRequest, ClientLogoutRequest, ClientSignupRequest } from 'types/client.type';

// TODO User 회원가입 / 로그인 / 로그아웃 / 회원 탈퇴 기능 구현
@Controller('users')
export class ClientController {
  constructor(private readonly client: ClientProvider) {}

  @Post('signup')
  async signupController(@Body() request: ClientSignupRequest) {
    try {
      const { email, password } = await clientSignupValidator(request);

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

      const uuid = await this.client.login(email, password);

      return new SetResponse(200, { uuid });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('logout')
  async logoutController(@Body() request: ClientLogoutRequest) {
    try {
      const { uuid: clientUuid } = await clientLogoutValidator(request);

      const uuid = await this.client.logout(clientUuid);

      return new SetResponse(200, { uuid });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
