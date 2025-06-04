import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";
import { Role } from "src/common/enums/role.enums";
import {
  CreateUser,
  IUserManager,
  SafeUser,
  UpdateRole,
  UpdateUser,
} from "./interfaces/user-repository.interface";
import { CreateUserDto } from "./dto/create-user-dto";
import { UpdateUserDto } from "./dto/update-user-dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { sanitizeUser } from "./utils/sanitize-user";

@Injectable()
export class UserRepository implements IUserManager {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: CreateUserDto): Promise<CreateUser> {
    const createdUser = await this.prisma.user.create({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
      },
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
      firstname: createdUser.firstname,
      lastname: createdUser.lastname,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
    };
  }

  async update(user: UpdateUserDto): Promise<UpdateUser> {
    const updatedUser = await this.prisma.user.update({
      data: {
        firstname: user.firstname,
        lastname: user.lastname,
      },
      where: {
        id: user.id,
      },
    });
    return {
      id: updatedUser.id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async softDelete(id: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return sanitizeUser(user);
  }

  async hardDelete(id: string): Promise<SafeUser | null> {
    const { password, ...safeUser } = await this.prisma.user.delete({
      where: { id },
    });
    return safeUser;
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(
        `User with an email of ${email} is not found.`
      );
    }

    return user;
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with an id of ${id} is not found.`);
    }

    return sanitizeUser(user);
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<UpdateRole> {
    const { email, role } = updateRoleDto;
    const userRoleUpdated = await this.prisma.user.update({
      where: { email },
      data: { role },
    });

    return {
      id: userRoleUpdated.id,
      firstname: userRoleUpdated.firstname,
      role: userRoleUpdated.role,
    };
  }
}
