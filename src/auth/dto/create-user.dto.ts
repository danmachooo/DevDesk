import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role, User } from "generated/prisma";

export class CreateUserDto
  implements Omit<User, "id" | "createdAt" | "updatedAt" | "role">
{
  @IsString({ message: "Firstname must be string" })
  @IsNotEmpty({ message: "Firstname is required " })
  firstname: string;

  @IsString({ message: "Lastname must be string" })
  @IsNotEmpty({ message: "Lastname is required " })
  lastname: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be atleast 6 characters" })
  password: string;
}
