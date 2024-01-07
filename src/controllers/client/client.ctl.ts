import { Body, Controller, Post, Res } from '@nestjs/common';
import { clientLoginValidator } from '@validators/client/login.validator';
import { clientSignupValidator } from '@validators/client/signup.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { Response } from 'express';
import { ClientProvider } from 'providers/client/client.pvd';
import { ClientLoginRequest, ClientSignupRequest } from 'types/client.type';

// TODO User 회원가입 / 로그인 / 로그아웃 / 회원 탈퇴 기능 구현
@Controller('users')
export class ClientController {
  constructor(private readonly client: ClientProvider) {}

  @Post('signin')
  async signupController(@Body() request: ClientSignupRequest) {
    try {
      const { email, name, password } = await clientSignupValidator(request);

      const message = await this.client.checkEmailandSignup(email, name, password);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('login')
  async loginController(@Body() request: ClientLoginRequest, @Res() response: Response) {
    try {
      const { email, password } = await clientLoginValidator(request);

      const jwt = await this.client.login(email, password, response);

      return response.status(200).send(jwt);
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
