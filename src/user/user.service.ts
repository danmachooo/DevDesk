import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  CreateUser,
  IUserManager,
  SafeUser,
  UpdateRole,
  UpdateUser,
  User,
} from "./interfaces/user-repository.interface";
import { CreateUserDto } from "./dto/create-user-dto";
import { UpdateUserDto } from "./dto/update-user-dto";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { UpdateRoleDto } from "./dto/update-role.dto";

Injectable();

export class UserService implements IUserManager {
  constructor(
    private userRepo: IUserManager,
    private readonly configService: ConfigService
  ) {}

  async create(createDto: CreateUserDto): Promise<CreateUser> {
    const saltRounds = this.configService.get<number>("SALT") ?? 10;
    const hashedPassword = await bcrypt.hash(createDto.password, saltRounds);
    const userData = {
      ...createDto,
      password: hashedPassword,
    };
    const user = await this.userRepo.create(userData);
    return user;
  }
  async update(updateDto: UpdateUserDto): Promise<UpdateUser> {
    const updateUser = await this.userRepo.update(updateDto);
    return updateUser;
  }
  async softDelete(id: string): Promise<SafeUser | null> {
    await this.findById(id);
    const softDeleted = await this.userRepo.softDelete(id);

    return softDeleted;
  }

  async hardDelete(id: string): Promise<SafeUser | null> {
    await this.findById(id);
    const hardDeleted = await this.userRepo.hardDelete(id);

    return hardDeleted;
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found!");
    }
    return user;
  }

  async findById(id: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException("User not found!");
    }
    return user;
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<UpdateRole> {
    await this.findByEmail(updateRoleDto.email);
    return this.userRepo.updateRole(updateRoleDto);
  }
}
