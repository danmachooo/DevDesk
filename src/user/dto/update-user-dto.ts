import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString({ message: "Id must be a string" })
  @IsNotEmpty({ message: "An id is required!" })
  id: string;
  @IsString({ message: "Firstname must be string" })
  firstname: string;

  @IsString({ message: "Lastname must be string" })
  lastname: string;
}
