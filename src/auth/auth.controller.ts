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
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "generated/prisma";

import { AuthService } from "./auth.service";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enums";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { RequestWithUser } from "src/common/types/request-with-user";

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put("update-role")
  @UsePipes(
    new ValidationPipe({
      transform: true,
    })
  )
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: RequestWithUser
  ): Promise<User | null> {
    const currentUser = req.user as JwtPayload;

    if (
      updateRoleDto.email === currentUser.email &&
      updateRoleDto.role !== Role.Admin
    ) {
      throw new ForbiddenException("You can't remove your own admin role.");
    }
    try {
      const result = await this.authService.updateRole(updateRoleDto);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to update role",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
