import { Role } from "src/common/enums/role.enums";

// JWT payload interface
export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: Role;
  tenantId: string;
}
