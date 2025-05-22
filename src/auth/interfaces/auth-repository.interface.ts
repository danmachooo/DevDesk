import { CreateUserDto } from "../dto/create-user.dto";

import { User } from "generated/prisma";
import { Role } from "src/common/enums/role.enums";

export interface IAuthRepository {
  create(user: CreateUserDto): Promise<User>;
  findUserByEmail(id: string): Promise<User | null>;
  updateRole(email: string, role: Role): Promise<User | null>;
}
