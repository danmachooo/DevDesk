import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @IsString({ message: "Firstname must be string" })
  @IsNotEmpty({ message: "Firstname is required" })
  firstname: string;

  @IsString({ message: "Lastname must be string" })
  @IsNotEmpty({ message: "Lastname is required" })
  lastname: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password is too weak",
  })
  password: string;
}
