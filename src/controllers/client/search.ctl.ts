import { Body, Controller, Post } from '@nestjs/common';
import {
  searchEmailRequestValidator,
  searchPasswordRequestValidator,
  validatePasswordTempKeyRequestValidator,
} from '@validators/client/search.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/client/client.pvd';
import { SearchEmailRequest, SearchPasswordRequest, ValidatePasswordKeyRequest } from 'types/password.type';

@Controller('users/search')
export class ClientSearchController {
  constructor(private readonly client: ClientProvider) {}

  @Post('email')
  async searchEmailController(@Body() request: SearchEmailRequest) {
    try {
      const { name } = await searchEmailRequestValidator(request);

      const email = await this.client.searchEmail(name);

      return new SetResponse(200, { email });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('password')
  async searchPasswordController(@Body() request: SearchPasswordRequest) {
    try {
      const { name, email } = await searchPasswordRequestValidator(request);

      const message = await this.client.searchPassword(email, name);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('password/validate')
  async validatePasswordTempKeyController(@Body() request: ValidatePasswordKeyRequest) {
    try {
      const { tempKey } = await validatePasswordTempKeyRequestValidator(request);

      const message = await this.client.validateSearchingPasswordKey(tempKey);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
