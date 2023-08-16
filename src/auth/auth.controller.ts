import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //TODO: register
  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto) {
    return this.authService.register(userObject);
  }

  //TODO login
  @Post('login')
  loginUser(@Body() userObject: LoginAuthDto) {
    return this.authService.login(userObject);
  }
}
