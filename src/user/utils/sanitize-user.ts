import { User } from "generated/prisma";
import { SafeUser } from "../interfaces/user-repository.interface";

export function sanitizeUser(user: User): SafeUser {
  const { password, ...safeUser } = user;
  return safeUser;
}
