import { Body, Controller, Post } from '@nestjs/common';
import {
  changePasswordValidator,
  clientLoginValidator,
  clientLogoutValidator,
  clientMyPageValidator,
  clientSignupValidator,
} from '@validators/client/user.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/client/client.pvd';
import { ClientLoginRequest, ClientLogoutRequest, ClientMyPageRequest, ClientSignupRequest } from 'types/client.type';
import { ChangePasswordRequest } from 'types/user.type';

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
