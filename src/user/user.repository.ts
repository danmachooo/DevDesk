import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";
import { Role } from "src/common/enums/role.enums";
import { IUserRepository } from "./interfaces/user-repository.interface";
import { CreateUserDto } from "./dto/create-user-dto";
import { UpdateUserDto } from "./dto/update-user-dto";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: CreateUserDto): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
      },
    });
    return createdUser;
  }

  async update(user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
      },
      where: {
        id: user.id,
      },
    });
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return deletedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userFoundByEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!userFoundByEmail) {
      throw new NotFoundException(
        `User with an email of ${email} is not found.`
      );
    }
    return userFoundByEmail;
  }
  async findById(id: string): Promise<User | null> {
    const userFoundById = await this.prisma.user.findUnique({ where: { id } });
    if (!userFoundById) {
      throw new NotFoundException(`User with an id of ${id} is not found.`);
    }
    return userFoundById;
  }

  async updateRole(email: string, role: Role): Promise<User | null> {
    const userRoleUpdated = await this.prisma.user.update({
      where: { email },
      data: { role },
    });

    return userRoleUpdated;
  }
}
