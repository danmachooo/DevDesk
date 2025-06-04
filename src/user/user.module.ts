import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserController } from "./user.controller";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: "IUserManager",
      useClass: UserRepository,
    },
  ],
  exports: ["IUserManager"],
})
export class UserModule {}
