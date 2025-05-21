import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "generated/prisma";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.authService.create(createUserDto);
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || "Registration Failed",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post("login")
  @UsePipes(
    new ValidationPipe({
      transform: true,
    })
  )
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    try {
      const result = await this.authService.login(loginUserDto);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || "Login failed",
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
