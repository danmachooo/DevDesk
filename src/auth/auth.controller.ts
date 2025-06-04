import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  ForbiddenException,
  HttpCode,
} from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { User, Role as PrismaRole } from "generated/prisma";

import { AuthService } from "./auth.service";
import { UpdateRoleDto } from "../user/dto/update-role.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enums";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { RequestWithUser } from "src/common/types/request-with-user";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import { CreateUser } from "src/user/interfaces/user-repository.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(201)
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<{ message: string; user: CreateUser }> {
    const user = await this.authService.create(createUserDto);
    return {
      message: "You are now registered!",
      user: user,
    };
  }

  @Post("login")
  @HttpCode(201)
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ message: string; accessToken: string }> {
    const login = await this.authService.login(loginUserDto);
    return {
      message: "You are now logged in!",
      accessToken: login.accessToken,
    };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put("update-role")
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: RequestWithUser
  ): Promise<{ message: string; role: Role }> {
    const currentUser = req.user as JwtPayload;

    if (
      updateRoleDto.email === currentUser.email &&
      updateRoleDto.role !== Role.Admin
    ) {
      throw new ForbiddenException("You can't remove your own admin role.");
    }
    const user = await this.authService.updateRole(updateRoleDto);
    return {
      message: `${user?.firstname}'s role has been updated to ${user?.role}`,
      role: user?.role as Role,
    };
  }
}
