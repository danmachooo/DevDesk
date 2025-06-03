import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserController } from "./user.controller";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
  ],
  exports: ["IUserRepository"],
})
export class UserModule {}
