import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtAuthService: JwtService,
  ) {}

  async register(userObject: RegisterAuthDto) {
    const { password } = userObject;
    const passToHash = await hash(password, 8);
    userObject = { ...userObject, password: passToHash };
    return this.usersService.createUser(userObject);
  }

  async login(userObject: LoginAuthDto) {
    const { password } = userObject;
    const { username } = userObject;
    const findUser = await this.usersService.getUserByName(username);

    if (findUser instanceof User) {
      const checkPassword = await compare(password, findUser.password);
      if (!checkPassword)
        throw new HttpException('contraseña incorrecta', HttpStatus.FORBIDDEN);
      const payload = { id: findUser.id, username: findUser.username };
      const token = this.jwtAuthService.sign(payload);
      const data = {
        user: findUser,
        token: token,
      };

      return data;
    } else return findUser; //retorna el error http
  }
}
