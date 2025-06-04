import { CreateUserDto } from "../dto/create-user-dto";
import { UpdateUserDto } from "../dto/update-user-dto";
import { Role } from "src/common/enums/role.enums";
import { UpdateRoleDto } from "../dto/update-role.dto";

export interface IUserManager {
  create(createDto: CreateUserDto): Promise<CreateUser>;
  update(updateDto: UpdateUserDto): Promise<UpdateUser>;
  softDelete(id: string): Promise<SafeUser | null>;
  hardDelete(id: string): Promise<SafeUser | null>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<SafeUser>;
  updateRole(updateRoleDto: UpdateRoleDto): Promise<UpdateRole>;
}

export type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type SafeUser = Omit<User, "password">;

export type CreateUser = Pick<
  SafeUser,
  "id" | "email" | "firstname" | "lastname" | "role" | "createdAt"
>;

export type UpdateUser = Pick<
  SafeUser,
  "id" | "firstname" | "lastname" | "updatedAt"
>;

export type UpdateRole = Pick<SafeUser, "id" | "firstname" | "role">;
