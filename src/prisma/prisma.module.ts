import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Ensure PrismaService is exported
})
export class PrismaModule {}
