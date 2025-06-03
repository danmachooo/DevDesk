import { User } from "generated/prisma";
import { CreateUserDto } from "../dto/create-user-dto";
import { UpdateUserDto } from "../dto/update-user-dto";
import { Role } from "src/common/enums/role.enums";

export interface IUserRepository {
  create(createDto: CreateUserDto): Promise<User>;
  update(updateDto: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateRole(email: string, role: Role): Promise<User | null>;
}
