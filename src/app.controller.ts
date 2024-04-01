import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  Res,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, response } from 'express';

@Controller('user-api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}
  // Para Registrar usuarios
  // the date format has to be like this -> DD-MM-YYYY
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('middleName') middleName: string,
    @Body('email') email: string,
    @Body('password') password: string,
    // @Body('birthDay') birthDay: Date,
  ) {
    const userPivot = await this.appService.findOne({ where: { email } });
    if (!userPivot) {
      const hashedPassword = await bcrypt.hash(password, 12);
      // const newDate = new Date(birthDay);
      // console.log(typeof newDate);
      const user = await this.appService.create({
        name,
        middleName,
        email,
        // birthDay: newDate,
        password: hashedPassword,
      });
      delete user.password;
      return user;
    }
    return new NotAcceptableException('User Already Exists');
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.findOne({ where: { email } });
    if (!user) {
      return new UnauthorizedException('This User Doesn´t Exists');
    }
    if (user && !(await bcrypt.compare(password, user.password))) {
      return new UnauthorizedException('Incorrect Password');
    }
    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      message: 'succes',
    };
  }
  @Get('user')
  //validación de token
  //la cookie será preservada en todas las request hasta que se haga un logout
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException('Error on Token');
      }
      const id = data['id'];
      const user = await this.appService.findOne({ where: { id } });
      const { password, ...result } = user;
      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'succes',
    };
  }
}
