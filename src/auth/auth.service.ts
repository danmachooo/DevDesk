import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { IAuthRepository } from "./interfaces/auth-repository.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "generated/prisma";
import { NotFoundError } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    @Inject("IAuthRepository") private readonly authRepo: IAuthRepository,
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
    return this.authRepo.create(userData);
  }
  /**
   * Retrieves a User by email.
   * @param email User emai
   */

  /**
   * Authenticates a user and returns a JWT token
   * @param loginUserDto Login credentials
   */

  async login(
    loginUserDto: LoginUserDto
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.authRepo.findUserByEmail(loginUserDto.email);
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

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;

    return { accessToken, user: userWithoutPassword };
  }

  /**
   * Retrieves a User by email
   * @param email User email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.authRepo.findUserByEmail(email);
  }
}
