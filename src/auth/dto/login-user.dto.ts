import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Role, User } from "generated/prisma";

export class LoginUserDto
  implements
    Omit<
      User,
      "id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "role"
    >
{
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;
}
