import { Injectable, NotFoundException } from "@nestjs/common";
import { IAuthRepository } from "./interfaces/auth-repository.interface";
import { User } from "generated/prisma";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        `User with an email of ${email} is not found.`
      );
    }
    return user;
  }
}
