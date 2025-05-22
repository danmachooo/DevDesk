import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "src/common/enums/role.enums";

export class UpdateRoleDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsEnum(Role)
  role: Role;
}
