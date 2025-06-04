import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "./dto/login-user.dto";
import { User, Role as PrismaRole } from "generated/prisma";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import {
  CreateUser,
  IUserManager,
  UpdateRole,
} from "src/user/interfaces/user-repository.interface";
import { UpdateRoleDto } from "src/user/dto/update-role.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject("IUserManager") private readonly userManager: IUserManager,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Creates a new user
   * @param createUserDto User data
   */
  async create(createUserDto: CreateUserDto): Promise<CreateUser> {
    const saltRounds = this.configService.get<number>("SALT") ?? 10;

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds
    );

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };
    const user = await this.userManager.create(userData);

    return user;
  }
  /**
   * Retrieves a User by email.
   * @param email User emai
   */

  /**
   * Authenticates a user and returns a JWT token
   * @param loginUserDto Login credentials
   */

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userManager.findByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: "",
    };

    return this.signToken(payload);
  }

  /**
   * Retrieves a User by email
   * @param email User email
   */

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<UpdateRole> {
    return this.userManager.updateRole(updateRoleDto);
  }

  async signToken(payload: JwtPayload): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
