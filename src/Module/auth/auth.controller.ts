import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import Helpers from '@/Helpers/helpers';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  private readonly helpers = new Helpers();
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res() res) {
    const auth = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    if (!auth) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        'Unauthorized',
        auth,
      );
    }
    return this.helpers.response(res, HttpStatus.OK, 'Login Success', auth);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Res() res) {
    const tokenData = req.user;
    const profile = await this.authService.getProfile(tokenData.email);
    if (profile === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        'Admin not found',
        profile,
      );
    }

    delete profile['password'];
    return this.helpers.response(res, HttpStatus.OK, 'Login Success', profile);
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  async setProfile(@Request() req, @Body() payload, @Res() res) {
    const tokenData = req.user;
    const profile = await this.authService.getProfile(payload.email);

    if (tokenData.email !== profile.email) {
      return this.helpers.response(
        res,
        HttpStatus.BAD_REQUEST,
        'Email is already registered',
        null,
      );
    }

    const newPayload = {
      name: payload.name,
      email: payload.email,
      role: 'ADMIN',
    };

    if (typeof payload.password !== 'undefined') {
      newPayload['password'] = await bcrypt.hash(payload.password, 10);
    }

    await this.authService.updateProfile(tokenData.userId, newPayload);
    return this.helpers.response(res, HttpStatus.OK, 'Login Success', profile);
  }
}
