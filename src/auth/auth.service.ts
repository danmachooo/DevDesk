import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "./dto/login-user.dto";
import { User, Role as PrismaRole } from "generated/prisma";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import { IUserRepository } from "src/user/interfaces/user-repository.interface";
import { UpdateRoleDto } from "src/user/dto/update-role.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject("IUserRepository") private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Creates a new user
   * @param createUserDto User data
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };
    const user = await this.userRepo.create(userData);

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
    const user = await this.findByEmail(loginUserDto.email);
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
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return user;
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<User | null> {
    const user = await this.findByEmail(updateRoleDto.email);

    return this.userRepo.updateRole(updateRoleDto.email, updateRoleDto.role);
  }

  async signToken(payload: JwtPayload): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
