import { Request } from "express";
import { JwtPayload } from "../../auth/interfaces/jwt-payload.interface"; // or wherever you define it

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
