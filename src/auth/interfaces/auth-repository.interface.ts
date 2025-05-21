import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";

import { User } from "generated/prisma";

export interface IAuthRepository {
  create(user: CreateUserDto): Promise<User>;
  findUserByEmail(id: string): Promise<User | null>;
}
